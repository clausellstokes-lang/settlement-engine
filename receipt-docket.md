# RECEIPT — lane DOCKET — **COMPLETE for this dispatch · 3 LANDED · 2 STOPPED WITH MEASUREMENT**
⟦Seat: Opus 5 — Fable-unvalidated · Lane: DOCKET · dock `$SC/laneDOCKET`, detached, base `fd8b6df00` (verified on arrival: porcelain 0, links=453, never materialised)⟧

Items taken this dispatch: **1, 2, 5, 6, 7**. Items 3, 4, 8 are NOT mine.

| item | state | sha |
|---|---|---|
| 1 — `pg` undeclared / CI-only test | ⛔ **STOPPED — the brief's premise is REFUTED by measurement** | — |
| 2 — `generatedAt` churn | ⛔ **STOPPED at the brief's own fence — a reader depends on the wall clock (a chair ruling)** | — |
| 5 — AUDIT-2.2 paid-rights floor arm | ✅ **LANDED** (2 cars) | `2c7463bf1` + `a216df08a` |
| 6 — clamp detector reach + `planUnitCm` ceiling | ✅ **LANDED** | `20183b443` |
| 7 — `--preset` for whole-world-soak | ✅ **LANDED** | `014565980` |

**Dock:** base `fd8b6df00` → tip `a216df08a`, **four cars**, **porcelain 0**, node_modules never
materialised (451 symlinks, 0 real dirs, verified after the item-2 build ritual).

⏱ **THE QUIET WINDOW OPENED AT THE END OF THE RUN, AND EVERY OWED PROOF WAS TAKEN.**
The chair's gate held the box for almost the whole dispatch (`$SC/docketwork/quiet-docket.log`
+ `quiet-long.log`: 7 `vitest/dist/workers` at load 24–89). It opened at
`probe 11: load1=1.77 vitestWorkers=0 · consecutive_clean=3 · QUIET WINDOW OPEN`, and every
vitest run below went through `sh scripts/gate-mutex.sh --run --`. **Nothing is OWED.**

⛔⛔ **AND THE FIRST RUN RED. The red was mine, and it is the whole argument for running.**
`tests/ui/frozenExportRightsFloor.test.jsx` threw `TypeError: allModifiers.get is not a
function` at `SettlementCard.jsx:288` — the fixture handed the card a bare `{}` where
`SettlementsPanel` hands it the Map `getAllModifiers` returns. Fixed in car 2 (`a216df08a`),
then re-run green. Every proof in this receipt that says GREEN was executed with its exit
captured in-shell.

## THE EXECUTED SUITE RESULTS (final tip `a216df08a`)

| suite | result |
|---|---|
| `tests/ui/frozenExportRightsFloor.test.jsx` | **3 passed (3)**, exit 0 |
| `tests/soak-harness/soakScriptSeams.test.js` | **passed** (8 arms incl. the new ARM 8) |
| `tests/domain/townCartographyBuildings.test.js` | **passed** (incl. the new plan-unit ceiling arm) |
| `tests/lint/clampPrimitiveBaseline.test.js` | `✓ the NAMED CANNOT-CATCH alias is still at its address, with its passthrough body` · `✓ baseline never grows past its committed ceiling` · `× baseline exactly matches …` ⟵ **the PRE-EXISTING banked census row**, red at my base, unmoved by me |
| the four together | **41 passed, 1 failed (42)** — the one failure being that banked row |
| `tests/lint/` **WHOLE DIRECTORY** | **136 passed / 2 failed (138 files); 2130 passed / 2 failed (2132 tests)** |

### The two `tests/lint/` reds, both accounted for
1. `clampPrimitiveBaseline` arm 1 — the banked census row (`baseline` 62 vs `currentDefFiles`
   **72**; ACTUAL-first reading of `-`-prefixed rows razing/razingExecution/razingWitness/
   warAllianceRisk = in Expected, absent from Received). **Pre-existing.**
2. `sovereigntyLightingContract.walker.test.js` — **MY TRAIN MOVED IT**, exactly the
   test-adding hazard: `the estate's file count moved: expected 2522 to be 2521`.
   ACTUAL-first: the tree measures **2522**, the register says 2521.

### ⭐ THE COMPLETE LIGHTING-CENSUS BILL, MEASURED — not one figure at a time
The arm short-circuits at `files`, so a lane that reported only that number would hand the
chair a partial bill and a second red after the refreeze. I walked all five **in a throwaway
`git archive` copy** (`$SC/docketwork/censusscratch`, since deleted), never in the dock and
**never through the `LIGHTING_CENSUS_REFREEZE` door** — that register act is the chair's.

| key | register | the tree | delta | cause |
|---|---|---|---|---|
| `files` | 2521 | **2522** | +1 | the new test file |
| `parked` | 371 | **371** | 0 | the new file is CREDITED, not parked |
| `credited` | 2150 | **2151** | +1 | " |
| `titles` | 23184 | **23190** | **+6** | exactly this lane's new tests: 1 (item 7) + 2 (item 6) + 3 (item 5) |
| `suiteTitles` | 6214 | **6216** | +2 | the new file's two `describe` blocks |

`parked + credited = 371 + 2151 = 2522 = files` — the register's own arithmetic identity holds.
⭐ **CONFIRMED, not predicted:** with that whole tuple in the scratch register the walker ran
**34 passed (34), exit 0**. The dock's register is byte-untouched (verified: still
`2521 371 2150 23184 6214`, porcelain 0).

⚠ The test-ratchet's own register moves in step and by the same arithmetic:
**totalTests 31491 → 31497 (+6), totalFiles 2468 → 2469 (+1), skippedCeiling 1 unchanged.**
Both registers are the chair's to take at the landing.

---

## ITEM 1 — ⛔ STOPPED. `pg` **IS** a declared devDependency at the product tip.

The brief's load-bearing premise — *"`pg` is NOT in `package.json`"*, and `DOCKET.md`'s
*"`pg` is not in `package.json` at all"* — is **FALSE at `fd8b6df00`**, so the ruled cure
is premised on a defect that does not exist and the cure the chair FORBADE (declaring it)
is the one already in the tree.

```
$ git -C <dock> show fd8b6df00:package.json | grep -n '"pg"'
119:    "pg": "^8.22.0",          # devDependencies, between lint-staged and postcss
$ git log --oneline -S'"pg":' -- package.json
a88be4f11 Composite integration: the cross-lane surface -- components, store, domain, edge, and their tests
$ grep -n '"node_modules/pg"' package-lock.json
6942:    "node_modules/pg": {
$ node -e "console.log(require.resolve('pg'))"
/Users/cstokes/Desktop/settlement-engine/node_modules/pg/lib/index.js      # 8.23.0
$ node --input-type=module -e "import('pg').then(m=>console.log('OK',typeof m.Client))"
OK function
```

**WHERE THE FALSE READING CAME FROM — measured, not guessed.** The MAIN REPO's *working
tree* is dirty and its `package.json` is a much older variant that lacks `pg`:

```
$ git -C /Users/cstokes/Desktop/settlement-engine status --porcelain -- package.json
 M package.json
$ git -C … show HEAD:package.json | grep -c '"pg"'   →  1   (HEAD c84edceb4 HAS it)
$ grep -c '"pg"' /Users/cstokes/Desktop/settlement-engine/package.json → 0  (the TREE does not)
$ git -C … diff HEAD -- package.json | wc -l → 121
```
That working copy also strips `postbuild`, `validate:hazard-registry`, `test:ratchet`,
`typecheck:ratchet`, `gen:dossier-prose` and the whole `gate-mutex` wrapping of `test`.
It is FOREIGN WIP and I did not touch it. A measurement taken in that tree reads a
package.json that is not the product's.

**The residual, which IS real and is a lane-ops hazard rather than a product fault:**
every dock symlinks the MAIN repo's `node_modules`. An `npm ci` run in the main repo
against that dirty `package.json` would evict `pg` from the shared store and then every
dock would fail to collect the file — which is exactly the signature `DOCKET.md`
describes. The cure for that is the dirty tree, not the test.

**The ratchet's own docblock already ruled on this file's shape** (`check-test-ratchet.mjs`,
the `collapsedSuitesOf` header, measured 2026-08-10): it names
`tests/security/customContentLockOrder.postgres.test.js` by path as *"a perfectly honest
skip"* whose row vitest counts in `numPendingTests`, and uses it as the corpus case that
REFUTED an earlier clock-only collapse detector. So the file already collects and skips
cleanly with `pg` present, and the skip it takes today is the one the ratchet expects.

There is no "parked" detector in `check-test-ratchet.mjs`; the relevant instrument is
`skippedCeiling` (the SKIP CEILING, `min`-monotone), and this suite already spends exactly
one row of it via `describeWithPostgres = ROOT_DATABASE_URL ? describe : describe.skip`.

**What I did NOT do, and why.** I did not build the dynamic-import cure. Its entire
rationale was the undeclared package; with `pg` declared, the change would add a second
guard over a hazard the declaration already covers, move a file the ratchet's header pins
by name and shape, and spend a car on a refuted finding. If the chair still wants the
dynamic import on the narrower ground *"a CI-only test should not hard-import a driver
even when the driver is declared"*, that is a fresh ruling on a different premise and I
will take it.

⏱ Not run: `npx vitest list` for the missing-package count. It is no longer load-bearing — the
declaration is in `package.json` and the module imports cleanly under node, both quoted above.

---

## ITEM 7 — ✅ LANDED `014565980` — `--preset` for the whole-world soak

**The brief's figures re-derived at this tip, and they MATCH exactly** (probe
`$SC/docketwork/preset-probe.mjs`, run in the dock, exit 0):

```
{"quiet_local":33,"realistic_regional":33,"dramatic_campaign":14,"static_campaign":34,
 "narrative_campaign":33,"living_realm":15,"full_simulation":0}
```
7 shipped presets confirmed. The leak is structural: `--rules-json` is an OVERLAY spread
on top of `full_simulation`, so every full_simulation key the target preset does not name
stays lit.

**The shape built.** `resolveSoakPreset({presetId, presets})` +
`SOAK_DEFAULT_PRESET_ID` in `scripts/audit/soakRules.mjs` (the pure side — the script runs
a soak on import, §145.2), the registry PASSED IN rather than imported so the
engine/telemetry wall is untouched; `--preset <id>` in `whole-world-soak.mjs` feeding
`composeSoakRules`'s existing `preset` seam; two refusals in `soakInvocationRefusals`.

**Proofs, every exit captured in-shell:**

| proof | result |
|---|---|
| `node $SC/docketwork/preset-probe.mjs` | **PROBE GREEN**, exit 0 — 7 presets, leak census, 7 composed key sets each equal to its own table with **zero** extra keys, golden identity, 6 refusal arms |
| default unmoved | `resolveSoakPreset({presetId:''})` returns `full_simulation` **and the same object** (`d.rules === SIMULATION_RULE_PRESETS.full_simulation.rules → true`); composed `fullRules`+`darkRules` byte-equal `soakRulesBaseline.json` for `--seasons preset|on|off` (6 comparisons) |
| CLI arm A | `node scripts/audit/whole-world-soak.mjs --preset bogus --years 1` → **exit 2**, `REFUSED: --preset "bogus" is not a shipped simulation preset. Known presets: dramatic_campaign, full_simulation, living_realm, narrative_campaign, quiet_local, realistic_regional, static_campaign.` |
| CLI arm B | `--preset quiet_local --rules-json /tmp/nope.json` → **exit 2**, `REFUSED: --preset with --rules-json. …` |
| both refusals fire BEFORE any soak | exit 2 in ~2 s; the gate sits directly under arg parsing |
| `npx eslint` on all four files | **exit 0** (`$SC/docketwork/eslint-item7.log`, empty) |
| `node --check` on all four files | exit 0 each |

**Judgment calls recorded for veto.**
1. **The receipt names the preset only when one was named** (`...(PRESET_ID ? {presetId} : {})`,
   the `caseId` pattern). Emitting it unconditionally would move every default receipt's
   bytes, and the ruling requires the no-flag run byte-identical. Cost: a default receipt
   still does not *say* `full_simulation`.
2. **`--lighting` stays composable with `--preset`**; only `--rules-json` is refused. The
   ruling named `--rules-json`, and `--lighting` lights NAMED keys on a stated base, which
   is what the flag sweep needs. The asymmetry is documented in the refusal text itself.
3. **A `--preset` with no registry is refused.** Without it the unknown-id arm could never
   fire — the assertion-that-cannot-fail shape.
4. **`scripts/review/readerCorpus.mjs`'s provenance addresses were re-measured** (six
   line references; they had already drifted ~2 lines and my change moved them 28–44).
   Comment-only; nothing parses them.

⚠ **REGISTER PREDICTION, IN WRITING, BEFORE ANY INSTRUMENT RUNS:** one new `it()` (ARM 8)
⇒ **totalTests +1, totalFiles unchanged, entries unchanged.** No baseline, ceiling or
census was edited.

⚠ **DECLARED CONSEQUENCE:** `scripts/audit/**` is inside `REALM_SCALE_SOURCE_PATHS`, so
the certification aggregate's `sourceFingerprint` MOVES and `sourceIdentityMatches` will
refuse to rebind pre-existing realm-scale evidence. The soak file's own header declares
this for any edit to it.

✅ **RUN, GREEN:** `npx vitest run tests/soak-harness/soakScriptSeams.test.js` — ARM 8 plus the
seven pre-existing arms, all passing.

---

## ITEM 6 — ✅ LANDED `20183b443` — the clamp detector's reach, and a ceiling for `planUnitCm`

**Both traps re-derived at this tip before anything was written.**

| claim | measured |
|---|---|
| `DEF_RE` cannot see `cartographyMorphology.js` | `DEF_RE.test(stripComments(src))` → **false** |
| `unit` is a passthrough clamp01 | `function unit(value) { return value < 0 ? 0 : value > 1 ? 1 : value; }` at line 62 |
| the file is not a baseline row | baseline 62 rows, does not contain it |
| the producer states a plan-unit range | `PLAN_UNIT_CM_BY_TIER` = {thorp 10, hamlet 14, village 20, town 30, city 50, metropolis 80}, keys **equal `CARTOGRAPHY_TIERS` both ways**, fallback `|| .town` is a member |
| the consequence | `HEIGHT_PLAN_CEILING` 60 × max 80 = **4800**, against an overflow at `planUnitCm ≳ 1.7e303` |

**Proof, executed without vitest** (`$SC/docketwork/clamp-arm-probe.mjs`, exit 0) — the new arm
replayed exactly, **plus two planted mutants held in memory** (no file was written):
`unit → clamp01` (DEF_RE then SEES it and the address pin loses its match) and the body
rewritten to `Math.max(0, Math.min(1, value))` (the body pin reds). The plan-unit extraction
ran against the real source and returned the table above. `npx eslint` exit 0,
`node --check` exit 0 on both files.

⚠ **MEASURED AND DECLARED, because a lane that lands into a red file must say so:**
arm 1 of `clampPrimitiveBaseline` is **RED at this base and stays red** — `currentDefFiles`
**72** against a frozen baseline of **62**, **zero stale rows**, the ten un-baselined being
cartographyBuildings, cartographyMultiplicity, conquestExecution, conquestFeasibility,
conquestIntent, dispositionLedger, razing, razingExecution, razingWitness, warAllianceRisk.
That is the BANKED census row (`scripts/.test-ratchet-baseline.json`, magnitude ceiling **78**,
so 72 passes the magnitude arm). ⭐ The row's `cause` string says **78**; the tree measures
**72**, so the population has FALLEN 6 since the row was written — the chair may want to
re-attribute it at the landing. I touched no baseline, ceiling or census byte.

**Judgment call recorded for veto:** the plan-unit cure is a **PIN, not a validator change**.
Adding a ceiling to `manifestContract.js:216` would make the validator reject manifests it
accepts today — a behaviour change on a contract, against the ruling's "zero behaviour
change". Wave 1's own precedent for the sibling trap (`storageCapacityMonths`) was "cheap
cure: pin the floor". If the chair wants the validator arm too, that is a separate ruling.

⚠ **REGISTER:** two new arms ⇒ **totalTests +2**, totalFiles unchanged. (Confirmed by the
lighting census's `titles` delta of +6 across all three cars: 1 + 2 + 3.)

✅ **RUN:** `tests/domain/townCartographyBuildings.test.js` green; `tests/lint/clampPrimitiveBaseline.test.js`
→ `✓ the NAMED CANNOT-CATCH alias is still at its address, with its passthrough body` (arm 1's red is
the pre-existing banked row); `tests/lint/` WHOLE run taken.

---

## ITEM 5 — ✅ LANDED `2c7463bf1` — the AUDIT-2.2 floor becomes machinery

New file **`tests/ui/frozenExportRightsFloor.test.jsx`** (3 arms). PDFDRIFT's finding
re-derived: exactly one test in the estate observes `generateSettlementPDF`'s options and
it mounts only `SettlementDetail` — the ACTIVE premium surface whose subject is threading
the live campaign IN. The two surfaces that must receive nothing were unobserved.

The mounts are deliberately **active-looking** (premium auth, `isElevated`, a live campaign
CONTAINING the save, a live `settlement` in the store that is a different object with a
different name, and non-null `worldState`/`regionalGraph` PROPS the card really does get
from CampaignFolder), so the arms measure what did NOT cross the seam rather than an empty
fixture. Each arm carries its own non-vacuity control, and the faith gate is asked a second
time with `faithUnlocked: true` and must answer **true**.

**Executed at commit time, before the window opened** (the mounted-arm run came later and is
reported below):

| proof | result |
|---|---|
| `node $SC/docketwork/rights-floor-probe.mjs` | **GREEN**, exit 0 |
| — `handleExportFrozen` | `s.settlement, { phase: canonPhaseOf(s) }`; no live-world identifier in the body; **no `useStore.getState()`**; button only in `!active && planInactive` |
| — `handleDownload` (anonymous) | `settlement, { isAnonymous: false }`; likewise clean |
| — ⛔ **discriminating control** | the SAME extractor over `SettlementDetail`'s `runExport` reports **[campaign, faithUnlocked]** present AND `useStore.getState()` present — the floor and the doorway are told apart by one instrument |
| `npx eslint` on the new file | exit 0 |
| esbuild transform | exit 0 — the file parses, JSX and all |
| scanner-family sweep | 0 un-anchored negatives (so `negativeAssertionAnchor` takes no row and no total moves) · 0 control bytes · 0 golden writes · 0 `Date.now`/`Math.random` · OUT of `contractTestAntiVacuity`'s scope |

⚠ **REGISTER:** **totalFiles 2468 → 2469**, **totalTests +3**.

✅ **RUN — and it RED first, on my own fixture.** See car 2 (`a216df08a`): the mount is a real
mount and said so (`TypeError: allModifiers.get is not a function`). After the fix:
**3 passed (3), exit 0.**

⛔⛔ **AND THE ARMS WERE PROVED NON-VACUOUS BY A PLANTED LEAK.** The forbidden change was
written into the product file — `generateSettlementPDF(s.settlement, { phase: canonPhaseOf(s),
worldState, regionalGraph, faithUnlocked: true })` — and BOTH frozen-card arms went red by
their own causes:

```
expected { phase: 'canon', …(3) } to deeply equal { phase: 'canon' }
expected [ …(2) ] to deeply equal []
  + "options.worldState === the live campaign worldState"
  + "options.regionalGraph === the live regionalGraph"
```

That is precisely the change PDFDRIFT observed a chair could have ruled while the suite stayed
green. It no longer can. The plant was restored by **INVERSE EDIT** and verified with `cmp`
against a backup taken BEFORE the plant — byte-identical, md5 `6ddb31be8f7dc45c416e9226ca54e552`
on both sides. No product byte moved.

---

## ITEM 2 — ⛔ STOPPED at the brief's own fence: a reader DOES depend on the wall clock

**The churn is REAL and I re-derived it end to end.** Ritual honoured: a scratch extraction
(`git archive HEAD | tar -x`), node_modules symlinked, **only `immer` + `seedrandom`
materialised there**, two builds, then the scratch tree deleted. **The dock's node_modules
was never touched** (`find $D/node_modules -maxdepth 1 -type d` ⇒ 0 real dirs, before and
after).

```
BUILD A exit 0 · BUILD B exit 0 (same tree, nothing changed between them)
diff -r shared.A shared.B  →  exit 1, and the ENTIRE delta is 5 files x 1 line:
    "generatedAt": "2026-09-05T12:56:04.801Z"  vs  "...:05.327Z"   (aiCharter)
    ... the same single line in aiGrounding, aiOutputSchema, analyticsEvents, intentAtlas
  → all five *Bundle.js artifacts are BYTE-IDENTICAL across the two runs.
diff -r shared.committed shared.A  →  the same 5 lines and nothing else,
  so the COMMITTED bundles already reproduce byte-for-byte from a clean checkout at fd8b6df00.
```
⚠ **A correction to the brief: there are FIVE metas, not four** (aiGrounding, analyticsEvents,
aiCharter, intentAtlas, aiOutputSchema — `ENTRIES` in `scripts/build-edge-shared.mjs:33-39`).

### ⛔ THE STOP — the reader census, complete

The brief rules: *"If any reader depends on `generatedAt` being a wall-clock time (a
freshness check), that is a FINDING — report the reader and STOP."* **One does, and it is a
chair ruling.**

| reader | reads | wall-clock dependent? |
|---|---|---|
| `tests/edgeFunctions/edgeSharedBundleReproducibility.test.js:190-193` | `Date.parse(generatedAt)` must be finite | partially — any ISO string satisfies it |
| **`…:199-207`** — *"all bundles share a single build window — no stale siblings left behind"* | `Math.max(stamps) - Math.min(stamps) <= 10 min` | ⛔ **YES, essentially** |
| `scripts/lib/premortem-triggers.mjs:184-190` | `meta.inputs` only | no |
| the five `*.freshness.test.js` | `sourceHash` + `inputs` only | no |

The spread arm is **CR-EB-2 (b)**'s partial-rebuild detector, written after the 2026-08-02
incident that shipped a MIXED set — some bundles rebuilt, some left at an older run. Its
whole discriminating power is that independent runs produce DIFFERENT stamps: a sibling that
was not rebuilt carries an old wall-clock time and the spread blows past ten minutes.
(Measured at this tip the committed spread is **98 ms**, so the arm is live and passing.)

Derive the stamp from the input content hash and each meta's stamp becomes a function of its
**own** inputs — a stale sibling and a fresh one no longer differ *in time*, so the spread
measures nothing and the detector becomes a guard that cannot fail. Omit the field and both
arms die outright. **Either shape silently repeals a chair ruling**, which is exactly what
the brief's ⛔ forbids, so I built nothing.

### What the chair now has to rule on (the shape I would propose, offered as "test this, don't trust it")
The two requirements are separable and only *look* like one field:
- **reproducibility** wants a byte-stable meta;
- **CR-EB-2 (b)** wants evidence that all five artifacts came from ONE builder invocation.

A single **`buildId`** minted once per `build-edge-shared.mjs` process and written identically
into all five metas would satisfy (b) by EQUALITY rather than by proximity — strictly stronger
than a 10-minute window, and it makes the spread arm a `new Set(ids).size === 1` check. It
does not by itself make the meta byte-stable (a nonce still churns); a content-derived
`buildId` (e.g. a hash over all five `sourceHash`es) would be BOTH byte-stable AND a true
one-invocation witness, because a partial rebuild leaves one sibling carrying a different
set-hash. **That is a hypothesis about a mechanism, not a measurement — it needs its own
proof and it touches an artifact five freshness suites and a reproducibility pin read, so
it is the chair's call, not a repair.**

**Also measured, and green:** `node scripts/validate-edge-functions.mjs` → **exit 0**,
*"Edge function syntax and guard contracts are valid (79 files; 43 test suites env-scope
clean)."*

Receipts: `$SC/docketwork/edge-AB.diff`, `edge-CA.diff`, `edge-buildA.log`, `edge-buildB.log`,
`validate-edge.log`, and the three artifact snapshots `shared.committed/`, `shared.A/`, `shared.B/`.

---

# ⭐ RETROVALIDATION ROW (Opus 5 lane → Fable 5.1 chair)

## WHAT WAS JUDGED (each is a call, not a fact — veto any of them)

| # | judgment | where it lives |
|---|---|---|
| J1 | **Item 1 is a REFUTATION, not a repair.** `pg` IS declared at the product tip, so the ruled cure is premised on a defect that does not exist and the FORBIDDEN cure is the one already in the tree. I built nothing. | item 1 above |
| J2 | The residual behind item 1 is a **lane-ops hazard** (the main repo's dirty `package.json` + a shared `node_modules`), **not a product fault** — so it is reported, not cured. | item 1 |
| J3 | **Item 2 STOPS on the brief's own ⛔.** `edgeSharedBundleReproducibility`'s spread arm is CR-EB-2 (b)'s partial-rebuild detector and its whole power is that the stamp is a wall clock. A deterministic stamp repeals a chair ruling. | item 2 |
| J4 | The `buildId` shape I sketch for item 2 is offered as **"test this, don't trust it"** — a mechanism, not a measurement. | item 2 |
| J5 | The `planUnitCm` cure is a **PIN, not a validator ceiling**: a `manifestContract` ceiling would reject manifests accepted today (behaviour), and wave 1's precedent for the sibling trap was "pin the floor". | item 6 |
| J6 | The soak receipt names its preset **only when `--preset` was passed** (the `caseId` pattern), so the default receipt's bytes cannot move. | item 7 |
| J7 | **`--lighting` stays composable with `--preset`**; only `--rules-json` is refused. The ruling named `--rules-json`; `--lighting` lights NAMED keys on a stated base and the flag sweep needs that. | item 7 |
| J8 | I refreshed six provenance line-addresses in `scripts/review/readerCorpus.mjs` (comment-only) because my item-7 edit moved every line they name. | item 7 |
| J9 | I measured the **whole** lighting-census tuple in a throwaway `git archive` copy rather than reporting the single figure the arm short-circuits on. The register edits never touched the dock. | census bill |

## WHAT THE FABLE CHAIR MUST RE-DERIVE

1. ⛔ **J1 first.** If `pg` really is declared at the product tip, the item-1 ruling is void and the DOCKET.md finding needs correcting where it lives — it was measured against the main repo's dirty working tree. One command: `git show fd8b6df00:package.json | grep -n '"pg"'`.
2. ⛔ **J3.** Read `tests/edgeFunctions/edgeSharedBundleReproducibility.test.js:199-207` and decide whether CR-EB-2 (b) may be re-shaped at all. Nothing here should be built until that is ruled.
3. ⛔ **THE TWO REGISTER ACTS ARE YOURS**, and I predicted both in writing before any instrument ran:
   - lighting census → `files 2522 · parked 371 · credited 2151 · titles 23190 · suiteTitles 6216` (confirmed green at that tuple in a scratch copy, `34 passed (34)`), via `LIGHTING_CENSUS_REFREEZE` on a clean tree;
   - test ratchet → `totalTests 31497 · totalFiles 2469 · skippedCeiling 1`.
4. ⚠ **The clamp census row's `cause` string says 78; the tree measures 72.** The population has FALLEN 6 since the row was written. Worth re-attributing at the landing — I touched nothing.
5. J5 — whether you also want the `manifestContract.js:216` validator ceiling (a behaviour change on a contract).
6. J7 — the `--lighting` / `--rules-json` asymmetry.

## RECEIPTS BY PATH

| what | path |
|---|---|
| this receipt | `$SC/receipt-docket.md` |
| item 7 probe (7 presets, leak census, refusals) | `$SC/docketwork/preset-probe.mjs` |
| item 7 CLI refusals | `$SC/docketwork/cliA.err`, `cliB.err` |
| item 6 clamp arm + 2 planted mutants | `$SC/docketwork/clamp-arm-probe.mjs` |
| item 5 source probe + discriminating control | `$SC/docketwork/rights-floor-probe.mjs` |
| item 2 double build, A vs B and committed vs A | `$SC/docketwork/edge-AB.diff`, `edge-CA.diff`, `edge-buildA.log`, `edge-buildB.log` |
| item 2 artifact snapshots | `$SC/docketwork/shared.committed/`, `shared.A/`, `shared.B/` |
| `validate:edge` | `$SC/docketwork/validate-edge.log` (exit 0) |
| vitest: first targeted run (the red) | `$SC/docketwork/vitest-targeted.log` |
| vitest: item 5 after the fix | `$SC/docketwork/vitest-item5-b.log` (3/3, exit 0) |
| vitest: **the planted leak** | `$SC/docketwork/vitest-item5-mutant.log` (2 failed, by their own causes) |
| vitest: `tests/lint/` whole dir | `$SC/docketwork/vitest-lint-dir.log` (136/138 files) |
| vitest: the census bill walk | `$SC/docketwork/census-probe1.log`, `2`, `3` (probe 3 = 34/34, exit 0) |
| vitest: final targeted state | `$SC/docketwork/vitest-final.log`, `vitest-clamp-verbose.log` |
| eslint | `$SC/docketwork/eslint-item5.log`, `eslint-item6.log`, `eslint-item7.log` (all exit 0, all empty) |
| quiet-window probes | `$SC/docketwork/quiet-docket.log`, `quiet-long.log` |
| commit messages | `$SC/docketwork/msg-item5.txt`, `msg-item5b.txt`, `msg-item6.txt`, `msg-item7.txt` |

## PRIORITY

**HIGH** — J1 (a ruling on a refuted premise, and the DOCKET.md row that carries it),
J3 (a chair ruling would be repealed by the item-2 cure as briefed), and the two register acts.
**MEDIUM** — J5, the clamp row's stale 78, J7.
**LOW** — J4, J6, J8.

---

## DOCK FINAL STATE (verified in-shell)

```
HEAD      a216df08aa54291a1bb1610b3d19795e9b6f143d   (base fd8b6df00, 4 cars)
porcelain 0
node_modules  453 symlinks · every package still a SYMLINK (immer/seedrandom/react/vitest/
              esbuild all read `l`) · the only two real dirs are `.vite` and `.vite-temp`,
              vite's own run caches minted by my targeted vitest runs — NOT materialised
              packages, so the first-paint byte budget is not at risk
eslint    exit 0 over all seven touched files
diff      7 files changed, 721 insertions(+), 11 deletions(-)
```

⚠ **THE CARS EXIST ONLY AS THIS DOCK'S HEAD.** The preamble forbids ref writes to a lane, so
I did not seal them to `refs/preserve/*`. A scratch-dir death would take all four with it —
`a216df08a` is one `git worktree prune` from gone. **Sealing it is the chair's act and it is
cheap.**
