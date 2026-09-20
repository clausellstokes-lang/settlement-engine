# COMPOSE-REPROOF-1 — RECEIPT (the first composition sitting's re-proof at the composed tip)

**Lane** Opus COMPOSE-REPROOF-1 (VERIFY) · **Chair** Fable 5.1, session a9df403c
**Stamps read from `date` in the same call as the work:** dispatch read 2026-09-20 11:59:45 EDT;
chain launched 12:03:38 EDT; this receipt's last stamp is at its foot.
**Read tip** `$SP/read-tip-compose1` detached at **`578272a99e93425f33a3578affc7a62cad66c937`**
(`578272a99`, the seventh lighting refreeze over the composition `d279d13eb`).
`git status --short` **EMPTY at start** (12:01) **and at end** (see the foot). **Nothing edited,
nothing committed, no git mutation** beyond the chair-ordered `worktree add --detach`.

---

## 0. OUTCOME

*(filled at the foot — see §9 VERDICT)*

---

## 1. THE COMPOSITION'S FILE-SET PROOF — 21 of 21 CONFIRMED

`git log --oneline fb39b1ad6..578272a99` = **22 commits: the 21 lane commits + the refreeze**,
in the cherry-pick order below. For each, the composed commit's file set was compared against
the SOURCE commit on the lane branch, and the patch text compared too.

| lane | source → composed | file set | patch |
|---|---|---|---|
| FIX-L1 (CURE-A3) | `188f64b60` → `f888969e6` | EQUAL (1) | IDENTICAL |
| FIX-L1 | `38f119cac` → `59a5485a3` | EQUAL (25) | IDENTICAL |
| FIX-P3 F3 | `bccaef6e9` → `106804f72` | EQUAL (2) | IDENTICAL |
| FIX-P3 F4 | `5933b8328` → `63f3288ab` | EQUAL (8) | IDENTICAL |
| FIX-P3 F10 | `e25376ef9` → `b08a4ade0` | EQUAL (4) | IDENTICAL |
| FIX-P3 F11 | `df4fb56b5` → `2d02e420d` | EQUAL (4) | IDENTICAL |
| FIX-P3 F12+F13 | `6bf1d0623` → `e6f1816e2` | EQUAL (13) | IDENTICAL |
| FIX-P4 F5+F6 | `3b7eb66ee` → `c1f658113` | EQUAL (5) | IDENTICAL |
| FIX-P4 F15 | `268d0846c` → `28ae949ac` | EQUAL (4) | line numbers only |
| FIX-P5 | `e207d0718` → `55246e84d` | EQUAL (8) | line numbers only |
| FIX-P5 | `881c84863` → `0630218e4` | EQUAL (1) | IDENTICAL |
| FIX-P5 | `5c29fef92` → `e0c4d4f9c` | EQUAL (3) | IDENTICAL |
| FIX-P5 | `a5575107a` → `5236b05a6` | EQUAL (5) | line numbers only |
| FIX-P5 | `ec7d8a363` → `7dea316c7` | EQUAL (9) | IDENTICAL |
| FIX-P1 | `e0b03b63a` → `326dc232f` | EQUAL (8) | line numbers only |
| FIX-P1b | `92e959285` → `75ea6d0e4` | EQUAL (5) | IDENTICAL |
| FIX-C2b | `0bc7503b8` → `4d4535795` | EQUAL (1) | IDENTICAL |
| FIX-C2b | `a7cd336bb` → `cbb4fc4f2` | EQUAL (35) | line numbers only |
| FIX-C2b | `7330a89e9` → `12f5812dc` | EQUAL (2) | IDENTICAL |
| FIX-C2b | `b1c1ac182` → `92626a345` | EQUAL (2) | IDENTICAL |
| TOOL-13b | `42331a717` → `d279d13eb` | EQUAL (1) | IDENTICAL |

**The five "line numbers only" rows were NOT accepted on the label.** Each was re-compared with
the hunk headers and `index` lines stripped, so only the actual `+`/`-` lines remain:

```
FIX-P4  268d0846c -> 28ae949ac : ADDED/REMOVED LINES IDENTICAL (239 lines)
FIX-P5  e207d0718 -> 55246e84d : ADDED/REMOVED LINES IDENTICAL (540 lines)
FIX-P5  a5575107a -> 5236b05a6 : ADDED/REMOVED LINES IDENTICAL (285 lines)
FIX-P1  e0b03b63a -> 326dc232f : ADDED/REMOVED LINES IDENTICAL (623 lines)
FIX-C2b a7cd336bb -> cbb4fc4f2 : ADDED/REMOVED LINES IDENTICAL (502 lines)
```

**CONFIRMED: not one hunk was lost or altered in the composition.** The differing `@@` headers
are the expected line-number drift from an earlier lane's commit landing first in the same file.

⚠ **A FALSE GREEN WAS CAUGHT IN MY OWN INSTRUMENT AND IS RECORDED RATHER THAN QUIETLY FIXED.**
The first cut of this comparison used `for p in "sha sha lane"; do set -- $p`. zsh does not
word-split an unquoted expansion (LANE-PARALLEL's ZSH WARNING, second instance), so `git show`
received one ambiguous argument, `norm` produced nothing, and the script printed
`ADDED/REMOVED LINES IDENTICAL (0 lines)` for all five — a clean pass over nothing. The `(0 lines)`
count is the only thing that gave it away. Re-run with every sha spelled inline; the counts above
(239/540/285/623/502) are the proof the comparison had material to compare.

### 1.1 THE TWO FILES TWO LANES TOUCHED — BOTH LANES' ROWS PRESENT. CONFIRMED.

`tests/components/phoneChromeFloor.census.test.js` — touched by `b08a4ade0` (FIX-P3 F10) and
`55246e84d` (FIX-P5):

```
292:  '/signin':   { roots: 1, files: 11, floored: 5, ruled: 1, bare: 0 }   ← FIX-P3's F10 (4 -> 5)
271:  '/pricing':  { roots: 1, files: 14, floored: 17, ruled: 3, bare: 0 }  ← FIX-P5 (7 -> 17, bare 10 -> 0)
```
FIX-P5's removal of `owner: 'lane 28 — the pricing page'` also survives — the `/pricing` row
carries no `owner` key.

`scripts/mutation-coverage-manifest.json` — touched by `28ae949ac` (FIX-P4) and `5236b05a6`
(FIX-P5). **Both rationale rows are present**: `tests/lint/embeddedMapConsoleGate.walker.test.js`
(FIX-P4, at :938) and `tests/copy/tierWord.census.test.js` (FIX-P5, at :402).

---

## 2. ⭐ THE CHAIR'S EXTRA MEASUREMENT — WHICH NEW TEST FILE IS PARKED, AND WHY

**Instrument.** The walker's OWN `parkReasonsFor` / `liveTitlesIn` / `liveSuiteTitlesIn`, driven
outside vitest by the idiom the walker's own history records ("a probe executed THIS FILE'S OWN
`classify`, the vitest surface stubbed; walk/TEST_FILES/parkReasonsFor untouched, so it is this
file's code and not a transcription"). The probe is a COPY in this lane's scratch with **six
substitutions, each of which throws if it fails to apply** (the vitest surface → inert stubs;
`anchoredNegatives.js`, which imports vitest itself → an inert stub; `espree` → `createRequire`
at the read tip; two `src/` imports → absolute paths to the REAL modules; `ROOT` → the read tip).
Six grammar markers (`classifySource`, `classify`, `parkReasonsFor`, `liveTitlesIn`,
`liveSuiteTitlesIn`, `TEST_FILES = walk(`) are asserted present before the probe is written, so
the grammar is byte-identical to the shipped walker. **Nothing was written into the read tip.**

`git diff --name-only --diff-filter=A fb39b1ad6 578272a99 -- tests` → **exactly 8 files**:

```
tests/components/dossierRegenerateRefusal.test.jsx   CREDITED   5 titles /  1 suite   (FIX-P3)
tests/components/landingNarrateRefusal.test.jsx      CREDITED   5 titles /  2 suites  (FIX-P3)
tests/components/notFoundNotice.test.jsx             CREDITED   8 titles /  3 suites  (FIX-P3)
tests/components/refusalSaysItOnce.test.jsx          CREDITED  11 titles /  3 suites  (FIX-P3)
tests/components/signInNextReason.test.jsx           CREDITED   4 titles /  1 suite   (FIX-P3)
tests/copy/tierWord.census.test.js                   CREDITED   4 titles /  1 suite   (FIX-P5)
tests/lib/anonForkSalt.test.js                       CREDITED  20 titles /  4 suites  (FIX-P1/P1b)
tests/lint/embeddedMapConsoleGate.walker.test.js     ⛔ PARKED   0 titles /  0 suites  (FIX-P4)
    park reason: TEST_TABLE_UNPROVEN:test.each()
    park reason: TEST_TABLE_UNPROVEN:test.each()
    park reason: TEST_TABLE_UNPROVEN:test.each()
```

### THE PARKED FILE IS **`tests/lint/embeddedMapConsoleGate.walker.test.js`** — **FIX-P4's**.

**THE PARK IS BY THE WALKER'S OWN GRAMMAR, NOT A DEFECT.** The mechanism, read by symbol:

```js
const staticTableRows = (arg) => !!arg && arg.type === 'ArrayExpression' && arg.elements.length > 0
  && arg.elements.every((el) => !!el && el.type !== 'SpreadElement');
function tableProven(steps) { … if (!staticTableRows(call.args[0])) return false; … }
```

The file's three tables are `test.each(MUTED_CHANNELS)` at `:107`, `:114`, `:121`, where
`MUTED_CHANNELS` is an **Identifier** (`const MUTED_CHANNELS = ['INFO','TIME','WARN']` at `:67`),
not an `ArrayExpression` at the call site. `tableProven` therefore returns false and the file
parks three times on `TEST_TABLE_UNPROVEN`. This is the walker's documented census-neutral
`each`-family class, and the walker's own history block records the identical verdict for a
sibling instrument at line 4332: *"`grammarLifecycleKindPools.walker.test.js` … is PARKED
(`TEST_TABLE_UNPROVEN:test.each()` ×3) and contributes 0 titles and 0 suite titles"*.
**Parked is not weaker** — FIX-P4's own G2b line proves the file RUNS: `Tests 16 passed (16)`.

⛔ **FIX-P4'S RECEIPT CLAIM ON THIS POINT IS REFUTED BY EXECUTION.** It reads: *"`each` is in this
walker's CREDITED running grammar (`RUNNING_TEST_MODIFIERS`, `CREDITED_TABLE_MODIFIERS` …), so the
file is **not** a parking hazard — and no park/parse arm in the lighting file fired on it"*, and
declares the file's census shape as **4 suite titles / 16 tests**. Two doors were conflated:
`CREDITED_TABLE_MODIFIERS` names *which* modifiers **require** a proven table; it does not credit
them. The file's real census contribution is **0 / 0**.

### 2.1 THE ARITHMETIC THE CHAIR PREDICTED IS RIGHT IN TOTAL AND WRONG IN ROUTE

The chair's dispatch expected the refreeze to reconcile "EXACTLY IF ONE new test file
(8 titles / 2 suite titles) is PARKED". The gap it was reading is real — summing the seven lanes'
declared deltas over the sixth refreeze `2656·383·2273·25080·6684` predicts
`2664·358·2306·25509·6814` against a measured `2664·359·2305·25501·6812`: **+1 parked, −1 credited,
−8 titles, −2 suites.** But it is **two undeclared movements, both FIX-P4's, that happen to
net to −8/−2** — not one file of 8 titles / 2 suites:

1. FIX-P4's new walker is **PARKED**, so its declared **+16 titles / +4 suites is really 0 / 0**.
2. FIX-P4 **never declared** the `+8 titles / +2 suites` it added to the EXISTING
   `tests/components/postGenCoach.test.jsx` — measured `credited(14/2) → credited(22/4)`, which is
   its own red-first record (`Tests 7 failed | 15 passed (22)`) arriving in the census.

`−16 + 8 = −8` and `−4 + 2 = −2`. The chair's inference landed on the right total by the wrong route.

### 2.2 ⭐ THE SEVENTH REFREEZE IS CORRECT, AND IT IS NOW RECONCILED FILE BY FILE

A second probe classified **every one of the 57 test files changed in `fb39b1ad6..578272a99`** at
BOTH ends and summed the per-file movement:

```
THE COMPOSED RANGE'S TOTAL DELTA, MEASURED FILE BY FILE
files +8 · parked -24 · credited +32 · titles +421 · suiteTitles +128
sixth refreeze (register at fb39b1ad6): 2656 · 383 · 2273 · 25080 · 6684
predicted tip: 2664 · 359 · 2305 · 25501 · 6812
measured tip:  2664 · 359 · 2305 · 25501 · 6812
```

and the live tuple read straight off the walker's own five figures agrees to the digit:

```
files=2664 parked=359 credited=2305 titles=25501 suiteTitles=6812
register: {"measuredAtSha":"d279d13ebe718f07b278ec6d1a705a0870159079","measuredBy":"chair-fable-a9df403c",
           "date":"2026-09-20", … ,"files":2664,"parked":359,"credited":2305,"titles":25501,"suiteTitles":6812}
```

**Three independent derivations — the per-file sum, the live whole-estate measurement, and the
frozen register — agree on all five figures. The refreeze banks no error.** Only its NOTE's
attribution needs the correction in §2.1.

### 2.3 ⛔ THE COMPOSITION LANDS EXACTLY ON A MONOTONE-DOWN CEILING, WITH ZERO HEADROOM

FIX-P4's parked file joins the population capped by the walker's own
`⛔ THE EACH-FAMILY PARK DEBT ONLY SHRINKS` arm. Measured at both ends with that arm's own
predicates:

```
eachOnly                : base 110  ->  tip 111   (EACH_FAMILY_PARK_CEILING = 111)
literalTableStillParked : base  50  ->  tip  50   (LITERAL_TABLE_STILL_PARKED_CEILING = 50)
the ONLY move in either population across the whole range:
  JOINED eachOnly: tests/lint/embeddedMapConsoleGate.walker.test.js
```

`toBeLessThanOrEqual(111)` at 111 is **GREEN — but the last slot is now spent.** The next lane that
creates a test file parking only on `each`-shaped reasons REDS `tests/lint`. And the obvious
reformat is already convicted by the same arm: an inline literal table clears `TABLE_UNPROVEN`
and lands on `TEST_CONTEXT_PARAM`, i.e. `literalTableStillParked`, which is **also at its ceiling
of 50 with zero headroom.** The only cure the walker admits is its own prescription — a plain
parameterless `test` looping over the rows in its body with a per-row assertion label.
→ **CHAIR DECISION POINT (§9 item 1).** Not built: this lane edits nothing.

### 2.4 THE PARK HISTOGRAM AT THE COMPOSED TIP, AND FIX-L1'S CLASS

```
TEST_UNREGISTERED 247 · SUITE_NOT_STRAIGHT_LINE 146 · SUITE_NOT_RUNNING 99 ·
TEST_TABLE_UNPROVEN 68 · TEST_CONTEXT_PARAM 56 · SUITE_UNREGISTERED 21 ·
SUITE_TABLE_UNPROVEN 2 · OPENER_UNRESOLVED 1 · SUITE_REF 1
OPENER_UNRESOLVED-only files at the tip: 0
files carrying OPENER_UNRESOLVED at all: 1  (tests/edgeFunctions/contracts.test.js)
```

**FIX-L1's outcome survives the composition intact**: its class is closed (0 files), and the one
survivor is the mixed-reason file L1 reported out of scope. `TEST_TABLE_UNPROVEN` is 67 → **68**,
the +1 being FIX-P4's file.

---

## 3. THE FIVE SCRIPT LINES — ALL GREEN. CONFIRMED.

```
npm run validate:packets                      EXIT=0   [implementation-packets] valid: 194 packets (0 READY)
node scripts/wiring-census.mjs --check        EXIT=0   verified 708 pools / 2266 variants / 165 relation rows
                                                       against 7 stamped files
node scripts/check-observed-shape-readers.mjs EXIT=0   observed-shape readers: 1964 finding(s),
                                                       exactly matching the frozen inventory.   (stderr: 0 lines)
node scripts/check-writer-reach.mjs           EXIT=0   WRWALKER HOLD — judged 6537 · LIT 572 · LIT-NAME 4671 ·
                                                       DARK 1294 (reviewable 495) · pending-surface debt: 3 owner rows (§12 WRW-2)
```

`valid: 194 packets (0 READY)` is exactly the figure the brief named.

**THE GOLDENS AND THE FROZEN INVENTORY — byte-identical to the landing:**

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
dbd67ac549c081eaff0e937c448a2f53a763b2cf5a4a329a1aa5f7d6fa21441e  scripts/.observed-shape-readers-baseline.json
```

---

## 4. `npx eslint` BARE OVER THE UNION — 100 FILES, EXIT 0. CONFIRMED.

`git diff --name-only fb39b1ad6 578272a99 -- '*.js' '*.jsx' '*.mjs'` → **100 files**
(24 `src/components`, 19 `tests/domain`, 18 `tests/components`, 11 `tests/lint`, 5 `tests/property`,
and the rest one or two apiece, plus `vite.config.js` and `public/map/main.js`).

```
ESLINT EXIT=0
FILES LINTED: 100
errorCount total: 0   warningCount total: 1
  public/map/main.js  E0 W1  File ignored because of a matching ignore pattern.
```

⭐ **The file count is asserted, not assumed.** A bare run would have exited 0 just as happily on a
single mangled argument, so the run was repeated with `--format json` and the result array counted:
**100**. The one warning is the vendored FMG fork source being eslint-ignored, which is the estate's
standing arrangement and FIX-P4's stated reason for freezing that file with a walker instead.

---

## 5. THE CONSOLIDATED DIRECTORY CHAIN

*(count lines filled in §6 as each directory lands)*

Every line: `GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20
sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 <one directory>`,
both exports spelled INLINE, DEFAULT reporter, ONE directory per invocation.

⚠ **THE CHAIN WAITED AT THE MUTEX, NOT AROUND IT.** From 12:03:38 the shared entrant sat behind
run 22's EXCLUSIVE holder (`sh scripts/gate-mutex.sh --run -- node scripts/check-test-ratchet.mjs`,
started 12:01, running `vitest run --exclude=tests/build/** --reporter=json` in `$SP/consist`).
With `MAX_POLLS=100000 / POLL_SECONDS=20` the wait cannot expire into the 40-poll false green.

**Directory scope, and why.** The brief's union is run consolidated, one invocation per directory:
the four directories a lane CREATED a file in are run WHOLE under FOLD 112's law (`tests/components`,
`tests/copy`, `tests/lib`, `tests/lint`); the brief's other WHOLE directories are run WHOLE
(`tests/ui`, `tests/pdf`, `tests/domain`, `tests/property`); and the brief's named-scope directories
are run WHOLE as strict supersets of what the lanes declared (`tests/data`, `tests/config`,
`tests/design`, `tests/store`, `tests/generators`, `tests/scripts`, `tests/build`).
`tests/domain/autonomy` is run separately as well so FIX-L1's declared 14 prints on its own line.
**`tests/build` is run WHOLE (59 files) rather than FIX-C2b's six**, because the six are not named
in its receipt and a whole-directory run is a strict superset of both C2b's six and FIX-P4's four —
their differing skip counts (56p|42s over 6 files vs 60p|27s over 4) are dist-conditional arms, and
this read tip has **no build**, so dist arms skip. **`tests/security`: no lane touched it**
(`git diff --name-only fb39b1ad6 578272a99 -- tests/security` is empty), so FIX-P4's two declared
consumer files are run explicitly rather than the 148-file directory. Likewise `tests/map`, which
no lane touched but FIX-P4 declared.

---

## 6. EVERY COUNT LINE BY DIRECTORY, WITH THE LANE(S) IT DISCHARGES

⏳ **IN FLIGHT.** The live summary is `logs/SUMMARY.txt` in this scratch; each directory's full
output is `logs/<NN>-<dir>.log`. Acquisition proof for the first line:

```
gate-mutex: entered SHARED tier at /tmp/settlementforge-vitest-gate.502.lock.shared as PID 19162
after 48 poll(s); 2 shared holder(s) live, worker cap <= 2.
 RUN  v4.1.8 …/scratchpad/read-tip-compose1
```

48 polls × 20 s = the 16 minutes run 22's exclusive ratchet held the lock. The tree the harness
printed is the READ TIP, not a label.

| # | directory | lanes it discharges | count line |
|---|---|---|---|
| 01 | `tests/lint` WHOLE (175) | L1 · P3 · P4 · P5 · C2b · 13b | ⭐ **`Test Files 175 passed (175)` · `Tests 2818 passed (2818)` · EXIT=0 · 330.14s — NO RED AT ALL** |
| 02 | `tests/components` WHOLE (297) | P3 (297/2086) · P4 (postGenCoach) · P5 (dossier, pricing, arrow) · P1 | ⏳ |
| 03 | `tests/copy` WHOLE (13) | P3 (151) · P5 (155) | ⏳ |
| 04 | `tests/lib` WHOLE (174) | P1b (174/1797) · P4 (sfBridgeOrigin) | ⏳ |
| 05 | `tests/property` WHOLE (90) | L1 (34) · the goldens · EM-B1f's npcs.property | ⏳ |
| 06 | `tests/ui` WHOLE (162) | P5 (162/1076) · P3 (73) | ⏳ |
| 07 | `tests/pdf` WHOLE (46) | P5 (46/458) | ⏳ |
| 08 | `tests/data` WHOLE (24) | P1b (22) · C2b (dossierStateProseProjection 79) · P3 | ⏳ |
| 09 | `tests/config` WHOLE (8) | P5 (44) · P3 (24) | ⏳ |
| 10 | `tests/design` WHOLE (17) | P5 (73) | ⏳ |
| 11 | `tests/store` WHOLE (149) | P3 (14) · P1b (6) · P4 (6) | ⏳ |
| 12 | `tests/generators` WHOLE (113) | L1 (2) | ⏳ |
| 13 | `tests/scripts` WHOLE (9) | C2b (implementationSession 10) | ⏳ |
| 14 | `tests/build` WHOLE (59) | C2b (6 files) · P4 (4 files) — dist arms SKIP, no build here | ⏳ |
| 15 | `tests/map` (2) | P4 (34) | ⏳ |
| 16 | `tests/security` P4's two files | P4 (77) | ⏳ |
| 17 | `tests/domain/autonomy` (5) | L1 (14) | ⏳ |
| 18 | `tests/domain` WHOLE (986) | L1 (277) · P4 (guidance) · P1 (dataPurity) · C2b (subsystemRowsWar, roadsParticipation) · EM-B1f | ⏳ |

**EXPECTED REDS, and nothing else is permitted.** Per the chair's dispatch the lighting census is
GREEN at this tip (§2.2 confirms the register is exact), so the ONLY expected red in the whole
chain is `tests/property/dossierProseManifest.test.js`'s provenance title, inherited and
owner-gated (§934.71), which lands in run 05. Any other red is a composition defect and is
bisected by cherry-pick order against the shas in §1.

---

## 7. THE COMPOSED CURES, PRESENT AT THE TIP (ungated, executed)

Beyond the count lines, each lane's headline cure was read at the composed tip by symbol:

* **FIX-L1** — `OPENER_UNRESOLVED`-only class is **0 files** at the tip (§2.4); the origin file
  `calamity.kernel.integration.test.js` carries no `(it)` / `(test)` / `(describe)` rebind.
* **FIX-P3** — `refusalOf` returns the third field (`at: at || null`, `refusalReasons.js:221`);
  `lastRefusal` appears **nowhere** in `store/persistProjection.js`, so the new field reaches no
  save; `NotFoundNotice` is `lazy()`-mounted in `AppViews.jsx:65,153` behind `useMissedPath`;
  `SignInPage.jsx:53-54` names the waiting page through `routeLabelForView`. Its re-addressed
  prose-numerics row reads `line: 242` and `LandingArtifacts.jsx:242` really is `{town.pressure}`.
* **FIX-P4** — `public/map/main.js:27-29` now reads the fork's own switch
  (`const INFO = Boolean(DEBUG.info) || !PRODUCTION;` and the same for TIME/WARN) with
  `ERROR = true` at `:30`; the `docs/fmg-fork.md` §2 runbook row (`~8–30`) is present;
  `PostGenCoach.jsx:218` is `role="region"`; `bottomAnchoredChrome.walker.test.js:74` carries the
  struck row with its reason; `scripts/.ui-a11y-contract.json` is untouched (`"coach": 900`).
* **FIX-P5** — F14's single tier word landed on **"Thorpe"** across every table
  (`config/tierFacts.js:40`, `pdf/lib/viewModel.js:59`, `components/new/design.js:27`,
  `copy/en.js:165`); `publicChromeFloor.census` carries the three pricing roster rows and the new
  `PROSE_FLOOR_ROSTER` (9 / 12 / 3); `launchPillHostWrap:105` carries
  `'src/components/pricing/PricingBands.jsx': 2`.
* **FIX-P1 / P1b** — no `slice(0, 8)` survives in `sampleSettlements.js`; `forkSeedFor:210-214` is
  pure and total; `anonForkSalt.js` carries `KEY = 'sf.anon.fork-salt'`, `ACCOUNT_DIGEST_HEX = 12`,
  `ANON_SALT_HEX = 12`. ⭐ **P1b's NUL/binary hazard did not survive the composition**:
  `git diff --numstat` reports `229 0 src/lib/anonForkSalt.js` and `274 0` for its test — real
  numbers, not `-`; and **no file anywhere in the composed range is binary-classified**.
* **FIX-C2b** — `subsystemRowsWar.js` is still **771 lines**, so no line-addressed baseline drifts
  behind it; `tests/lint/.source-citation-baseline.json` has **`rows = 0`** with the
  `_burnedToZero` provenance intact. Its three MODULE-MOVE re-addressings resolve exactly:
  `warCapacityReads.js:74` = `export function computeAllyRelief(`, `warHomeCosts.js:109` =
  `export function computeLevySources(`, `warSiegeVerdict.js:305` = `capitulation: true,`; the
  nine-address war-depth flag block really occupies `warDeployment.js:474-480` in declaration
  order, and the parent gate at `:243` is `if (!rules?.warLayerEnabled) {`.
* **TOOL-13b** — `observedShapeReaders.walker.test.js` measures `credited(46/6) → credited(47/6)`,
  i.e. the erasure-guard arm arrived; the frozen inventory is byte-identical (`dbd67ac5…`) and the
  plain gate prints `1964 finding(s), exactly matching the frozen inventory`.

---

## 8. ⛔ NOTICED AND NOT TOUCHED

1. ⭐ **CHAIR DECISION POINT — the each-family park ceiling has zero headroom** (§2.3).
   `eachOnly` 110 → **111 of 111**; `literalTableStillParked` **50 of 50**. The next created test
   file that parks only on `each`-shaped reasons reds `tests/lint`, and the obvious reformat is
   convicted by the same arm. The only cure the walker admits for
   `tests/lint/embeddedMapConsoleGate.walker.test.js` is its own prescription — a plain
   parameterless `test` looping over `MUTED_CHANNELS` in its body with a per-row assertion label,
   which would return 16 titles / 4 suites to the census and free a ceiling slot. Whether to spend
   FIX-P4 follow-up time on it, or to re-bank the two ceilings at the next refreeze, is the chair's.
2. ⭐ **The seventh refreeze's NOTE mis-attributes its own reconciliation** (§2.1). The figures are
   exact; the sentence "exactly one new test file (8 titles / 2 suites) PARKED" describes a file
   that does not exist. The true statement is *two* undeclared FIX-P4 movements: its new walker is
   parked (0/0, not the declared 16/4) and it added +8 titles / +2 suites to the existing
   `tests/components/postGenCoach.test.jsx`. One sentence in the register's `note`.
3. **FIX-P4's receipt carries a refuted claim** that a successor may re-read as true (§2). Its
   "the file is not a parking hazard … 4 suite titles, 16 tests" should be annotated with the
   measured verdict, or the next lane reading that receipt will re-derive the same wrong shape.
4. **`literalTableStillParked` was ALREADY at its ceiling of 50 before this composition** — not
   this sitting's doing, but it means two monotone-down ceilings now both sit at zero headroom
   simultaneously. Worth one line in the hazards fold.
5. **`public/map/main.js` is eslint-ignored**, so the union lint reports it as a warning rather
   than linting it (§4). This is the estate's standing arrangement and FIX-P4's stated reason for
   freezing that file with a walker instead; recorded so the warning is not read as a defect.
6. **`check-writer-reach.mjs` prints three pending-surface debt rows** (isolationSupport,
   magicDependent, requiredCapacity → web-display, §12 WRW-2) and exits 0. Pre-existing owner rows,
   untouched by this composition; noted because the line looks like a failure and is not.

---

## 9. VERDICT

*(filled when the chain lands)*

---

## 10. STAMPS

*(filled when the chain lands)*
