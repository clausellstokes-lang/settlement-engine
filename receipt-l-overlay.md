# RECEIPT — L-OVERLAY (Opus 5 lane, Fable 5.1 chair) — ✅ **COMPLETE**
<!-- opened as PARTIAL and updated after every proof, per the fences; closed 2026-09-05 12:30 -->

⛔ ONE ITEM IS **OWED, NOT DONE**: the golden control (§6), with its command and the measured
reason the window could not open. Everything else below is executed and quoted.

**Lane** L-OVERLAY · **Seat** Opus 5 — Fable-unvalidated · **Chair** Fable 5.1 · 2026-09-05
**Dock** `$SC/laneOVERLAY`, detached at `38474a59eba460f30d6596dcb65efda3a446738a`
(HEAD and `git status --porcelain` = 0 both verified on arrival; `node_modules` entries are
SYMLINKS into the owner tree, verified — never materialised).
No rebase · no push · no ref write · **no register act** · no `git stash` · no `git checkout --` ·
no `git show HEAD:<path> >` · **no product byte edited**.

STATUS: **COMPLETE.** Every verdict below is **CONFIRMED** — executed, with the output quoted.
Nothing here is PLAUSIBLE-only. The one outstanding item is the golden control (§6), OWED.

---

## 0 · HEADLINE

> **A `--preset P` soak IS a real birth of P — for all seven presets, JSON-BYTE-IDENTICAL,
> key order included.** The `--preset` seam is honest; certification through it is honest.
> The old overlay "leak" was a TRUE finding about a seam DOCKET item 7 retired.

⇒ the brief's **branch 1**. Kit-only edits; **no product change is required** for the
certification to be honest. One product-byte defect was found on the way (a banner line that
prints a false preset name) and is **handed up, not taken**.

---

## 1 · PREMISES RE-DERIVED BEFORE ACTING — and **two of the chair's are REFUTED**

| premise as stated | measured at `38474a59e` | verdict |
|---|---|---|
| brief foot ①: `certify.sh` lines 11-32 still document "There is no `--preset`" and drive the soak through the `--rules-json` overlay | ✅ exactly so, before my edit: `certify.sh` passed `--rules-json "$f"` and its header carried the whole STOP | ✅ **HOLDS** |
| brief foot ②: with `--preset <id>`, `whole-world-soak.mjs:326-327` composes `composeSoakRules({ preset: SOAK_PRESET.rules, … })` | ✅ verbatim at `:326-330`, and `SOAK_PRESET = resolveSoakPreset(...)` at `:188-191` | ✅ **HOLDS** |
| brief foot ②, cont.: **"`SOAK_PRESET.rules` is the SPARSE override table"** | ⛔ **FALSE.** `preset(id,label,overrides)` (`simulationRules.js:501`) returns `{ ...DEFAULT_SIMULATION_RULES, presetId: id, ...overrides }`. **Keys missing from DEFAULT: 0, for all seven presets.** The table is TOTAL | ⛔ **REFUTED** |
| `preset-overlay.mjs:28-30`: the table "would leak by construction on almost every key" IF spread over full_simulation | ⛔ **FALSE for the same reason.** Spread over full_simulation it would leak on exactly the 14–34 VIRTUAL keys full_simulation adds — the same set the birth-derived overlay leaked. It is not "almost every key" | ⛔ **REFUTED** (kit prose, now corrected) |
| `lprobe/birth-fixtures.mjs` header: the table "omits every DEFAULT_SIMULATION_RULES key the preset does not override" | ⛔ **FALSE** (0 omitted, all seven). Its *other* reason — the table never runs the normalizer — is TRUE and is the one that matters | ⛔ **REFUTED** (kit prose, now corrected) |
| the 14–34 "leaked" keys are engine-gated VIRTUAL keys a birth never carries ⇒ the leak is the instrument's definition | ⛔ **half FALSE, and the important half.** They ARE virtual (absent from `DEFAULT_SIMULATION_RULES`) — but the leak was **REAL**: the overlay seam spread the birth's 37 keys ON TOP of full_simulation's 70, so 33 of full_simulation's own lit values SURVIVED into a "quiet_local" run. `preset-overlay.mjs` was right to refuse | ⛔ **REFUTED — the old instrument was correct** |
| brief: "record the golden control OWED if the window does not open" | the window is the binding constraint — see §6 | ✅ HOLDS |

⭐ The chair's **ruling** (measure the seam before re-pointing anything) was right. Two of the
**mechanisms** it named were wrong. That is the *charter-the-permission / measure-the-mechanism*
shape for the fourth time today.

---

## 2 · ⭐⭐ THE TABLE — measurement 1, all seven presets

Instrument: `$SC/laneOVERLAY-scratch/seam-table.mjs` (writes nothing into the tree; output
`$SC/laneOVERLAY-scratch/seam-table.json`). Three objects per preset:

* **(i) SOAK** — `composeSoakRules({ preset: SIMULATION_RULE_PRESETS[P].rules, seasons: 'preset', overlay: {} }).fullRules`,
  the soak's **own pure function**, called exactly as `whole-world-soak.mjs:326-330` calls it
  with no `--rules-json` and no `--lighting` (which is how `certify.sh` invokes it — and the
  two are mutually REFUSED upstream anyway).
* **(ii) BIRTH** — CAR 1's real-birth fixture `$SC/lh1/birth-fixtures-p1.json`
  (`createNewCampaignWorldState`, the expression `buildNewCampaign` evaluates), cross-checked
  against the battery's `f-birth-fixtures.json` (`prepareRulesUpdate`).
* **(iii) TABLE** — `SIMULATION_RULE_PRESETS[P].rules`, raw.

`DEFAULT_SIMULATION_RULES` = **36** keys · `normalizeSimulationRules()` = **30** keys.

| preset | (i) soak | (ii) birth | (iii) table | norm(table) | soak≡table | norm(table)≡birth | **soak≡birth** | keys soak-only | keys birth-only | value diffs | key order ≡ | JSON bytes ≡ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `quiet_local` | 37 | 37 | 37 | 37 | ✅ | ✅ | ✅ | 0 | 0 | 0 | ✅ | ✅ |
| `realistic_regional` | 37 | 37 | 37 | 37 | ✅ | ✅ | ✅ | 0 | 0 | 0 | ✅ | ✅ |
| `dramatic_campaign` | 56 | 56 | 56 | 56 | ✅ | ✅ | ✅ | 0 | 0 | 0 | ✅ | ✅ |
| `static_campaign` | 36 | 36 | 36 | 36 | ✅ | ✅ | ✅ | 0 | 0 | 0 | ✅ | ✅ |
| `narrative_campaign` | 37 | 37 | 37 | 37 | ✅ | ✅ | ✅ | 0 | 0 | 0 | ✅ | ✅ |
| `living_realm` | 55 | 55 | 55 | 55 | ✅ | ✅ | ✅ | 0 | 0 | 0 | ✅ | ✅ |
| `full_simulation` | 70 | 70 | 70 | 70 | ✅ | ✅ | ✅ | 0 | 0 | 0 | ✅ | ✅ |

**Zero keys present in (i) and absent from (ii). Zero the other way. Zero value differences.
Zero key-order differences. `JSON.stringify(soak) === JSON.stringify(birth)` for all seven.**

### 2b · ⭐⭐ WHY it holds — and the reason is NOT the one the brief expected

`composeSoakRules` is `{ ...preset, ...seasonsOverride(seasons), ...overlay }`. **It does NOT
normalize.** A real birth resolves through `prepareRulesUpdate → normalizeSimulationRules`.
The two nevertheless agree for exactly one measured reason:

> ⭐ **`normalizeSimulationRules` is a FIXED POINT on every shipped preset table**
> (`norm(table) === table`, byte for byte, all seven), because `preset()` already spreads
> `DEFAULT_SIMULATION_RULES` — the table is total over the 36 default keys — and no shipped
> override needs a coercion, trips the `faithSpread ↔ religionDynamics` mirror lockstep, or
> changes the `PROFILE_KEYS` materialize branch's outcome.

⚠⚠ **THAT IS A MEASURED PROPERTY OF TODAY'S TABLES, NOT A GUARANTEE, AND NOTHING PINNED IT
BEFORE THIS LANE.** The day a preset override needs the normalizer — a non-boolean where a
boolean belongs, one side of the mirror pair set alone, a profile key added — `composeSoakRules`
will not apply it and **the soak will silently certify a world no birth produces**. Control that
the predicate discriminates, executed:

```
live table  : norm(table)===table -> true
coerced key : norm===self -> false      (stressorsEnabled: "true" instead of true)
missing key : norm===self -> false      (emergentEventsEnabled deleted)
```

The new `preset-seam.mjs` asserts this fixed point per preset, so the day it breaks is loud.
**This is the forward risk this lane's kit edit exists to close.**

### 2c · Which seam `certify.sh` used, and whether the two agree — measurement 2

* **Before my edit:** `--rules-json "$OVERLAYS/overlay.<id>.json"`. The battery's full run
  (`lprobe-out-899-full`) certified **one** preset (`full_simulation`), and `TRUE_EXITS.certify.txt`
  reads `TRUE_EXIT_overlay=1` — the refusal of the other six.
* **Do the two seams produce the same `fullRules` for P?** For `full_simulation` **YES**
  (it leaked 0, so overlay-over-full ≡ full). For the other six **NO** — the overlay seam
  produced full_simulation's value on 14–34 keys. The `--preset` seam produces the birth.
* ⚠ **ONE DECLARED RECEIPT-BYTE SHIFT** between the old battery run and any new one:
  `receiptBody` emits top-level `presetId` **only when the flag was NAMED**. The old
  `b-receipt.full_simulation.json` therefore has **no** `presetId` field (verified: `presetId
  present: false`), while the new `certify.sh` passes `--preset full_simulation` explicitly and
  the receipt gains one. `subsystems.presetId` was already `"full_simulation"` in both. The
  soak's own **no-flag default run is unchanged**; only the battery now names the preset.

### 2d · ⭐ THE END-TO-END TIE — the pure function is not the world

A real soak was run at the dock, `--preset quiet_local --years 1 --settlements 2`
(`TRUE_EXIT=0`, wall **3 s**; `$SC/laneOVERLAY-scratch/e2e/`). Read back OUT OF THE RECEIPT:

```
receipt.presetId            = "quiet_local"
subsystems.presetId         = "quiet_local"     <- read off runA.simulationRules, not the flag
subsystems.stateKeys.simulationRules = {"years":1,"maxEntries":37,"finalEntries":37}
subsystems.rules (25 boolean switches) vs the REAL BIRTH: 0 value diffs, 0 keys absent from the birth
```

**37 = the real birth's key count for `quiet_local`.** The world the soak actually advanced
carried the birth's rules, not full_simulation's. `certify.sh` now performs this readback for
every preset and REFUSES a receipt whose world disagrees with the seam prediction.

---

## 3 · WHAT I CHANGED — **KIT ONLY** (`$SC/lprobe/*`; the chair seals these)

| file | change |
|---|---|
| **`lprobe/preset-seam.mjs`** | **NEW.** The honest instrument. Per preset: composed `fullRules` vs the fixture's real-birth rules — **both directions**, keys + values + **key order** + JSON bytes — plus the `norm(table) === table` fixed-point assertion. Writes `preset-seam-report.json` and one `seam-ok.<id>` marker per passing preset. Exits 1 naming every difference. Accepts either fixture shape (`resolvedRules` or `world.simulationRules`) and REFUSES a row carrying neither — never skips it |
| **`lprobe/certify.sh`** | Re-pointed to the `--preset` seam: step 1 is `preset-seam.mjs`; the soak takes `--preset "$id"` and **no** `--rules-json`; the roster is the marker files (a broken seam has no marker ⇒ cannot be certified by accident); a **post-soak READBACK** refuses a receipt whose `presetId`/`subsystems.presetId`/`finalEntries` disagree with the seam; **`WALL_SECONDS_soak_<id>`** recorded per preset. Header STOP prose replaced with the measured truth |
| **`lprobe/preset-overlay.mjs`** | **RETIRED to a fail-closed STOP (exit 2).** Its historical finding and figures are preserved verbatim in its header; it can no longer produce a receipt about a defect that has been fixed. (⛔ what is dead is *overlay-as-preset-substitute* — `--rules-json`/`--lighting` remain lawful overlays on a stated base) |
| **`lprobe/birth-fixtures.mjs`** | Header only: the false "SPARSE OVERRIDE TABLE … omits every DEFAULT key" claim corrected to the measured truth; the fence itself is unchanged and still right |
| **`lprobe/README.md`** | Output-(b) row, supporting-files table, the whole "(b) is a STOP for six of the seven presets" section, and the (b) cost row |

Syntax gates, executed (⛔ an empty file passes `sh -n`, so sizes are quoted too):
`sh -n certify.sh` **0** · `node --check` on all three .mjs **0** ·
certify.sh 10 639 B, preset-seam.mjs 13 121 B, preset-overlay.mjs 3 997 B ·
`certify.sh --dry` **0** · retired `preset-overlay.mjs` refuses with **exit 2**.

### 3b · NEGATIVE CONTROL — the new instrument CAN fail

Three mutants planted in a **copy** of the fixture (the tree and the real fixture untouched):

| mutant | result |
|---|---|
| A — `quiet_local.stressorsEnabled` flipped `true→false` | ⛔ killed: `value differs on stressorsEnabled: soak=true birth=false` |
| B — `realistic_regional.emergentEventsEnabled` deleted | ⛔ killed: `keys the SOAK carries and the BIRTH does not (1): emergentEventsEnabled` |
| C — `dramatic_campaign` key order REVERSED, content identical | ⛔ killed: `the key ORDER differs — the world state is serialized…` |

`TRUE_EXIT_negctl_seam=1`; **4 markers written, not 7.** A green from this instrument is earned.

---

## 4 · WHAT I HANDED UP — one PRODUCT change, NOT taken

`$SC/laneOVERLAY-scratch/HANDUP-banner.diff` — the exact diff, one term.

**`scripts/audit/whole-world-soak.mjs:605` prints a FALSE preset name.** Quoted from a real
run of `--preset quiet_local`:

```
# whole-world soak — 1 years × 2 settlements, seed "lov-quiet_local", full_simulation preset (seasons preset), now pinned 2026-07-12T00:00:00.000Z
```

The JSON receipt is correct; the human-readable header — the line a reader pastes into a
receipt — is not. The fix is `full_simulation` → `${SOAK_PRESET.id}`, which is byte-identical
on the no-flag default run (`SOAK_DEFAULT_PRESET_ID = 'full_simulation'`), is declared far
above :605 (no TDZ), moves no receipt byte, and is pinned by **no test**
(grep over `tests/ scripts/ src/` returns only the line itself plus unrelated prose).

⚠ **Why it is the chair's and not mine:** `whole-world-soak.mjs` is inside
`REALM_SCALE_SOURCE_PATHS`, so ANY edit moves the certification aggregate's
`sourceFingerprint` and `sourceIdentityMatches` refuses to rebind pre-existing realm-scale
evidence. **That is a register cost, and register acts are the chair's.**

Two lower-value rows in the same file are recorded in the hand-up (stale `:8` docblock prose;
`realm-scale-certification.mjs` never forwards `--preset`, only `--lighting`) — neither is a
false receipt, and both would pay the same fingerprint cost, so they belong folded into the
banner car if the chair takes it at all.

---

## 4b · THE SEAM CHECK ON THE REAL FIXTURE — executed, and the readback arm controlled

```
TRUE_EXIT_seam_real=0
  quiet_local            seam HOLDS — soak keys=37 == birth keys=37, values equal, order equal, norm(table)==table
  realistic_regional     seam HOLDS — soak keys=37 == birth keys=37, values equal, order equal, norm(table)==table
  dramatic_campaign      seam HOLDS — soak keys=56 == birth keys=56, values equal, order equal, norm(table)==table
  static_campaign        seam HOLDS — soak keys=36 == birth keys=36, values equal, order equal, norm(table)==table
  narrative_campaign     seam HOLDS — soak keys=37 == birth keys=37, values equal, order equal, norm(table)==table
  living_realm           seam HOLDS — soak keys=55 == birth keys=55, values equal, order equal, norm(table)==table
  full_simulation        seam HOLDS — soak keys=70 == birth keys=70, values equal, order equal, norm(table)==table
preset-seam: 7 preset(s), 0 refused
```

**The readback arm was negative-controlled too**, against real data rather than a mutant:

| control | result |
|---|---|
| the OLD overlay-seam `b-receipt.full_simulation.json` (no `--preset` was passed, so no top-level `presetId`) | ⛔ `READBACK REFUSAL: receipt.presetId is undefined, not "full_simulation"` — exit 1 |
| the `quiet_local` seam row vs the `full_simulation` world (70 entries vs a predicted 37) | ⛔ `REFUSAL` |

`sh run.sh <tree> <outdir> --dry` over the whole rewired battery: **exit 0**, every step
`DRY_TRUE_EXIT_*=0`, and the (b) leg now prints the `--preset` plan.

---

## 5 · ⭐⭐ CERTIFICATION RE-RUN — **ALL SEVEN CERTIFIED**, one at a time

The chair's full-suite gate (`sh scripts/gate-mutex.sh --run -- npx vitest run`, from
`laneDESKPROOF2`) held the machine 12:00→12:16 at load 25→57 with 11–15 workers. **The lane
waited** rather than run a CPU-heavy soak into it. Run window **12:21:08 → 12:26:59**:
`START load=10.66 busy=4` · `END load=10.64 busy=10` — sibling lanes were still running
targeted vitest, so ⚠ **the wall-clock column below is an UPPER BOUND, not a clean figure.**
(The soak's own assertions are not meaningfully load-sensitive at 5 y: `wallTimeTrendVerdict`'s
band is `q4 <= q1 × 8 + 50 ms`, which a uniform slowdown cannot breach.)

| preset | seam | `TRUE_EXIT_soak` | `TRUE_EXIT_readback` | `TRUE_EXIT_certify` | wall | receipt `finalEntries` | lit switches | cert rows: ALIVE / DORMANT_BY_CONFIG / SILENT / UNOBSERVED |
|---|---|---|---|---|---|---|---|---|
| `static_campaign` | HOLDS | **0** | **0** | **0** | 10 s | 36 | 1 | 0 / 24 / 0 / 62 |
| `quiet_local` | HOLDS | **0** | **0** | **0** | 20 s | 37 | 9 | 7 / 16 / 1 / 62 |
| `narrative_campaign` | HOLDS | **0** | **0** | **0** | 21 s | 37 | 11 | 6 / 14 / 4 / 62 |
| `realistic_regional` | HOLDS | **0** | **0** | **0** | 26 s | 37 | 12 | 8 / 13 / 3 / 62 |
| `living_realm` | HOLDS | **0** | **0** | **0** | 62 s | 55 | 31 | 18 / 12 / 7 / 49 |
| `dramatic_campaign` | HOLDS | **0** | **0** | **0** | 90 s | 56 | 35 | 24 / 8 / 4 / 50 |
| `full_simulation` | HOLDS | **0** | **0** | **0** | 121 s | 70 | 45 | 27 / 11 / 5 / 43 |

`preset-seam: 7 preset(s), 0 refused` · `certify.sh: certified 7 preset(s)` ·
`TRUE_EXIT=0` · `TRUE_EXIT_certify_sh=0`. Every receipt `passed: true`, `failures: []`.
`notExecutable` is 1 for six presets and 2 for `static_campaign` — the liveness floor needs a
FULL decade and this run is 5 years, exactly as the §899 battery recorded.

**⛔ MY PRE-RUN PREDICTION WAS WRONG AND I SAY SO.** `$SC/laneOVERLAY-scratch/PREDICTIONS.md`
predicted "AT LEAST ONE of the four dark presets exits 1". **None did — all seven exited 0.**
Every other predicted figure held (readback 0, certify 0, seam 0/7 refused, wall 10–121 s
against a predicted 20–60 s band that the sibling load pushed `full_simulation` past).

### 5b · ANTI-VACUITY — the seven soaks really ran seven different worlds

```
static_campaign      finalHash=45eeaf548170944f77d4  litSwitches=1   realmBytes=  786172
quiet_local          finalHash=8e6cc3b4d5cb6ab17a54  litSwitches=9   realmBytes= 1133221
narrative_campaign   finalHash=ee9287b18c990bb04373  litSwitches=11  realmBytes=  854038
realistic_regional   finalHash=dd1deaf7ff796197fdb0  litSwitches=12  realmBytes= 1330615
living_realm         finalHash=946f3bf18f7ffae4a459  litSwitches=31  realmBytes= 1458830
dramatic_campaign    finalHash=5315feb39fd6fcc28ecb  litSwitches=35  realmBytes= 1481597
full_simulation      finalHash=299c16153f40020a0a8a  litSwitches=45  realmBytes= 1659658

DISTINCT finalHash values: 7 of 7
```
Lit-switch count and realm bytes rise monotonically with the preset's depth, and
`static_campaign` grades **0 ALIVE / 24 DORMANT_BY_CONFIG** against `full_simulation`'s
**27 ALIVE**. This is per-preset evidence the wave could not previously produce at all.

### 5c · ⭐⭐ CROSS-SEAM CONTROL — the strongest single result in this receipt

The NEW `--preset full_simulation` receipt vs the §899 battery's OLD `--rules-json overlay`
receipt for the same preset, same seed, same size:

```
keys only in OLD : []
keys only in NEW : [ 'presetId' ]
non-volatile fields that DIFFER: 0  (none)
finalHash equal   : true      yearlyHashes equal : true
subsystems equal  : true      behavioral equal   : true
```

**The two seams produce a bit-identical world.** That is independent confirmation that
`--preset` composes exactly what the overlay composed where the overlay was total — and it
lands my predicted §2c shift precisely: the single new field is the top-level `presetId`,
emitted only because the flag is now named.

---

## 6 · THE GOLDEN CONTROL — **OWED**, with the command and the measured reason

**Not run. Recorded OWED, as the brief permits.** The window did not open and could not.

**Measured, not assumed** (12:27–12:28, immediately after the certification):
`load1 = 6.74 → 6.18` (ceiling 4.0) · `busy = 13` (must be 0) · **four** sibling
`gate-mutex.sh --run -- npx vitest run …` holders queued (`tests/lint/`,
`tests/ui/mountFirstPaint…`, `tests/lint/dossierMountRegistry…`, `tests/lint/observedShapeReaders…`).
`quiet_window` requires **3 consecutive probes 60 s apart** at load1 < 4.0 with busy == 0, and
self-refuses with **exit 4** after 40 probes. Blocking ~40 minutes to earn a 4 is waste.

⛔ **AND THE ARM HAS NEVER BEEN EXECUTED AT THIS TIP.** `lprobe-out-899-full/TRUE_EXITS.golden.txt`
contains exactly one line — `TRUE_EXIT_quiet_window=4` — so the §899 battery's output (a)
produced **neither** instrument: no `generatorGoldenMaster` row-movement figure and no
600-row dormancy corpus. **Output (a) is wholly unmeasured at `38474a59e`.**

THE COMMAND, to run on a genuinely quiet machine (zero vitest, load1 < 4.0):

```sh
sh $SC/lprobe/golden-control.sh $SC/laneOVERLAY $SC/laneOVERLAY-scratch/golden
#   step 2  sh scripts/gate-mutex.sh --run -- npx vitest run tests/property/generatorGoldenMaster.test.js
#           -> expect 3 passed and 0 of 525 rows moved (capture the ROW MOVEMENT, not the green)
#   step 3  node scripts/dormancy-bit-compare.mjs --tree <TREE> --arm generation
#           -> exactly 600 rows, else the script refuses to call it a control
#   ⛔ UNFLOORED is NOT a pass — it says the corpus RAN, not that it DISCRIMINATES
#   add --base <BASE-TREE> for the two-tree diff; the comparator refuses a self-comparison
```

---

## 7 · RETROVALIDATION ROW (owed to the Fable 5.1 chair)

### 7a · THE KIT FILES FOR THE CHAIR TO SEAL into `refs/preserve/chair-tools-2026-09-05`

| file | md5 | bytes |
|---|---|---|
| `lprobe/preset-seam.mjs` **(new)** | `f962586af3fff6b03726f5c8d24c0b13` | 13 121 |
| `lprobe/certify.sh` | `7cab05ea5897cdabb65c1756c504f703` | 10 639 |
| `lprobe/preset-overlay.mjs` **(retired to a STOP)** | `d5573eca7bdbc6bfab84383681b9db6a` | 3 997 |
| `lprobe/birth-fixtures.mjs` (header + one comment) | `e66ea3dbba21c6980a4b8960693a4a03` | 10 871 |
| `lprobe/README.md` | `649c9dc03c7c47590b0bc0efc52ce452` | 12 489 |
| `lprobe/smoke/SUPERSEDED-2026-09-05.md` **(new)** | `760a63b2cd86c2565729dd7399a85720` | 1 027 |

`preset-seam.mjs` was `chmod +x`-ed after the md5s above were taken, to match its siblings;
the mode change does not move the content hash.

**Also produced (evidence, not kit):** `$SC/laneOVERLAY-scratch/` — `seam-table.mjs` +
`seam-table.json` (THE TABLE), `PREDICTIONS.md`, `HANDUP-banner.diff`, `e2e/`,
`negctl/`, `drycheck/`, and `cert899/` (the seven receipts, seven certifications, the seam
report and `TRUE_EXITS.certify.txt`).

### 7b · REGISTER DELTAS — **ALL ZERO**, predicted in writing before the run and unchanged after

This lane edited **no product byte**. The dock is at the sha it opened on and
`git status --porcelain --untracked-files=all` is **0** at close. Lighting census, test
ratchet, golden-freeze register, `sizeBaseline`, writer-reach, OSR, domain-any, tuning and the
realm-scale `sourceFingerprint` all move by **0**, because nothing under `src/` or `tests/`
was added, renamed, deleted or edited. **No register act was taken.**

⛔ **NO `tests/lint/` DIRECTORY RUN IS OWED**, and this is stated with its reason rather than
skipped: the preamble's rule fires "whenever your cars add, rename or delete any file under
`src/` or `tests/`". This lane's cars are the empty set — every edit is under `$SC/lprobe/`,
outside the tree.

---

## 8 · WHAT I GOT WRONG

**My own pre-run prediction that at least one dark preset's soak would exit 1.** All seven
exited 0 (§5). The prediction was recorded before the run in
`$SC/laneOVERLAY-scratch/PREDICTIONS.md` and is left there uncorrected, as the record.

---

| # | what this Opus seat JUDGED | what the chair must RE-DERIVE | receipts by path | priority |
|---|---|---|---|---|
| 1 | that the `--preset` seam is HONEST and certification may be re-pointed to it — i.e. brief branch 1, not branch 2 | that byte-identity of composed `fullRules` to the REAL birth is the right bar, and that CAR 1's fixture is the right control to measure it against | `$SC/laneOVERLAY-scratch/seam-table.json` · `seam-table.mjs` · §2 | **HIGH** — it decides which branch of the brief the wave takes |
| 2 | ⛔ that the brief's "`SOAK_PRESET.rules` is the SPARSE override table" is **FALSE**, and so are two kit headers that said the same | that `preset()` at `simulationRules.js:501` really does spread `DEFAULT_SIMULATION_RULES`, so 0 default keys are missing from any preset table | §1 · the `missingFromDEFAULT(0)` measurement · `f-birth-fixtures.json`'s `overrideTableKeys` == `resolvedRuleKeyCount`, all seven | **HIGH** — it re-cuts the brief's own reasoning |
| 3 | ⚠⚠ that the seam holds only because **`normalizeSimulationRules` is a FIXED POINT on today's preset tables**, that nothing pinned this before, and that the new instrument must assert it | that a fixed point is the right thing to guard, and whether this belongs in the PRODUCT as a test rather than only in the kit — my read is that it does, but a product test is a new test file and therefore the chair's register act | §2b · the discrimination control (coerced/missing key ⇒ `norm===self false`) · `preset-seam.mjs` | **HIGH** — this is the live forward risk |
| 4 | that `preset-overlay.mjs` should be RETIRED to a fail-closed STOP rather than left runnable, because a stale "6 of 7 REFUSED" is a decayed claim wearing a receipt's clothes | that retiring beats keeping, and that its historical figures are adequately preserved in its header + `lprobe-out-899-full/overlays/overlay-leak-report.json` + `lprobe/smoke/SUPERSEDED-2026-09-05.md` | `lprobe/preset-overlay.mjs` (exit 2 proven) · `lprobe/smoke/SUPERSEDED-2026-09-05.md` | MEDIUM |
| 5 | that the `whole-world-soak.mjs:605` banner fix is a PRODUCT change and therefore **not mine to take**, because the file is inside `REALM_SCALE_SOURCE_PATHS` and any edit is a `sourceFingerprint` move | that the one-term diff is right, that no test pins the string, and that the register cost is worth paying now rather than at the landing | `$SC/laneOVERLAY-scratch/HANDUP-banner.diff` · `e2e/soak.quiet_local.log:1` | MEDIUM |
| 6 | that `certify.sh` should carry a POST-SOAK READBACK (`presetId` + `finalEntries`) rather than trusting the pure-function seam check alone | that a receipt-level tie is the right shape, and that `subsystems.stateKeys.simulationRules.finalEntries` is a sound witness for "the world carried these rules" | `certify.sh` §2 · the two readback negative controls | MEDIUM |
| 7 | that the full_simulation receipt GAINING a top-level `presetId` between the §899 battery run and the new one is a DECLARED, benign shift | that the battery's own receipts may move this way, and that the soak's no-flag default run is what must stay byte-identical (it does) | §2c | LOW |
| 8 | that the golden control is OWED rather than attempted-and-failed, on the measured ground that four sibling vitest holders make `quiet_window` unreachable — **and that output (a) has NEVER been executed at this tip** (`TRUE_EXIT_quiet_window=4` is the whole of the §899 golden exits file) | that (a) is a real outstanding hole in the §899 evidence, not a soft one, and when the machine will be quiet enough to close it | §6 · `lprobe-out-899-full/TRUE_EXITS.golden.txt` | **HIGH** |

---

## 9 · FENCES, EACH ONE HONOURED

* No register act, no register door, no `--update`/`--write`/`--genesis`/`--rebank`, no `*_REFREEZE`/`UPDATE_*` env var.
* No product change: `whole-world-soak.mjs` and every other tree file are **UNEDITED**; the one product fix found is handed up as a diff.
* No preset table touched.
* No full-suite run, no `npm run check`, no `npm run build`. **No vitest at all** — this lane ran none, so the gate mutex was never contended by it.
* No subagents (the lane is one of the owner's four).
* No rebase, no push, no ref write, no `git stash`, no `git checkout --`, no `git show HEAD:<path> >`.
* `node_modules` left as symlinks; never materialised, never `npm install`.
* Every exit captured in-shell (`CMD; E=$?` or `_lib.sh`'s `step`/`note`), never from a task notification. No fallback branch prints a finding.
* Scratch written only under `$SC/laneOVERLAY-scratch/` and the chair's own `$SC/lprobe/`. (One file was first written to the session root by mistake and was **moved**, not left: `HANDUP-banner.diff`.)
* Receipt opened as a PARTIAL header before any measurement and updated after every proof.
* Mutants were planted in **copies** only; the tree and the real fixture were never mutated, so no restore was needed and none is owed.

---

**DOCK TIP: `38474a59eba460f30d6596dcb65efda3a446738a` — UNMOVED. NO PRODUCT CAR.**
