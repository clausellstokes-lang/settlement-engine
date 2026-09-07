# RECEIPT — L-PROBE-KIT (Opus 5 lane, Fable 5.1 chair) — **COMPLETE**

**STATUS: COMPLETE.** 2026-09-05. Deliverable: the dark-arm battery under `$SC/lprobe/` — 16 files,
`run.sh` + 8 output helpers + 4 supporting + README. Written PARTIAL first per the preamble and updated
after every proof; this header was flipped last, on the evidence below.

**Nothing committed anywhere. Zero product bytes.** Dock `$SC/lanePROSE2` porcelain **0** at arrival and at
close; no farm, temp file or scratch dir left in the dock or `$TMPDIR`. `sh -n` green on all 5 shell
scripts and `node --check` green on all 11 `.mjs` at close (`TRUE_EXIT_final_parse_gate=0`).

**What is proven and what is not.** CONFIRMED by execution: the eager STOP, (c), (d), (e), (f), (g), the
(b) overlay-leak STOP, and a full `--dry` of all ten steps. NOT executed and labelled so: (a) the golden
master + 600-row dormancy arm (vitest + two trees), (b) the soaks themselves, (h) the two builds, and
`presence-dump --mode exact` — those are the chair's, on the post-PROSE tree.

## Steps


## Step 1 — recon at the dock (CONFIRMED)
Dock `$SC/lanePROSE2` HEAD `4efce2e95ffb9d36b7f1e3819592fc38515e10f5`, detached, 6 porcelain entries
(the chair's live register work — untouched by this lane). `node_modules/vitest` is a SYMLINK; never materialised.

**Four chair-claims re-derived and CORRECTED before anything was built:**
1. `refs/preserve/light-plan-2026-09-05:PLAN.md` does not exist. The plan is at
   `refs/preserve/light-plan-2026-09-05:lightingwave/PLAN.md` (`git cat-file -t` = commit; root tree holds one entry, `lightingwave`).
2. The OSR presence logic is NOT in `scripts/check-observed-shape-readers.mjs`. `presenceOf`, `SCHEMA_PRESENCE`
   and `schemaKeys` live in `scripts/lib/observed-shape-corpus.mjs` — at exactly the lines the chair named (`:434`, `:437`,
   `:462`, `:463`). The line numbers were right; the FILE was wrong.
3. `scripts/.size-baseline.json` + `tests/lint/sizeBaseline.test.js` is an **eslint max-lines ratchet measured over
   `src/` by eslint's own `Linter`** — it has nothing to do with a build or with bytes. PLAN §8's "Size baseline …
   measuring act: the build" row is wrong on the mechanism. The listing STOP's real margin is
   `CLOSURE_BUDGET_BYTES = 1_048_000` in `tests/build/vendorPdfLazy.test.js:565`, measured over the entry's transitive
   STATIC import closure and gated on `VERIFY_DIST=1`.
4. `scripts/audit/whole-world-soak.mjs` has **no `--preset` flag**: it is hardwired to
   `SIMULATION_RULE_PRESETS.full_simulation.rules` at `:299`.

## Step 2 — a fifth finding the brief did not anticipate (CONFIRMED)
The STOP "the preset catalog measures EAGER" needs **no build**. `tests/build/campaignRuntimeLazy.test.js:145` already
pins `src/domain/worldPulse/simulationRules.js` as absent from `sourceStaticClosure('src/main.jsx')` — a SOURCE-level
read whose helpers sit in the file's pure region (first column-0 `describe(` is at `:129`).

## Step 3 — the store layer cannot be imported by a plain node script (CONFIRMED, with the cure built)
The REAL birth path throws before it runs:
```
TypeError: Cannot read properties of undefined (reading 'VITE_SUPABASE_URL')
    at .../src/lib/supabase.js:17:38
```
`campaignImportedCreation.js` -> `lib/campaigns.js` -> `lib/supabase.js`, whose `:17` reads `import.meta.env.VITE_SUPABASE_URL`.
Every `scripts/audit/` script reaches only `src/domain/**` and `src/generators/**`, so nothing in the tree had hit this.
Cured by `$SC/lprobe/env-shim.mjs` (a `node --import` loader hook). Smoke, quoted verbatim:
```
TRUE_EXIT_smoke_birth_one=0
env-shim: injecting an EMPTY import.meta.env (the product's unconfigured arm).
  realistic_regional     lit= 12 dark= 13 keys=37 roundTrip=yes hash=46919e4d4c53
birth-fixtures OK  presets=1 refusals=0 digest=600935bf1dd9
```

## Step 4 — the battery, written and dry-run (CONFIRMED)
`$SC/lprobe/` — 16 files. `sh -n` green on all 5 shell scripts, `node --check` green on all 11 `.mjs`.
Full `run.sh --dry` exercised all ten steps; `run.sh --dry --cheap` re-run after the fixes below.
**A dry run writes exactly one file — its own `TRUE_EXITS.txt`.** Verified by `find`.

### Two bugs found in my OWN driver by self-audit, both fixed before the dry run was trusted
1. `${DRY:+--dry}` fires when `DRY` is the string `"0"` (POSIX `:+` tests non-empty, not truthy), so every
   sub-script would have been handed `--dry` on a LIVE run. Removed entirely; `step` now appends `--dry`
   itself in dry mode and runs the helper, so the printed plan is the helpers' own statement.
2. Sub-scripts inherited `EXITS_FILE` from `run.sh` and then `: > "$EXITS_FILE"` — **each child would have
   truncated the parent's captured receipts.** Each sub-script now owns its file; `listing.sh`'s is
   per-LABEL because it runs twice into one outdir.
3. `run.sh` carried the fallback-prints-a-finding shape: `git rev-parse HEAD 2>/dev/null || echo '(not a
   git tree)'`. A git failure for any other reason would have printed that claim as evidence. Replaced with
   an exit-captured branch that reports git's own stderr.

### Self-audit results (grep over the whole kit)
```
--dry accepted by all 12 entry scripts:  OK
set -e in all 5 shell scripts:           OK
register doors (--update/--write/--genesis/--rebank/*_REFREEZE): only in comments and dry-output strings
npm install / node_modules materialisation: none (only the prohibition comment in listing.sh)
`|| echo` fallbacks: none that print a finding (2 comments, 2 ternaries)
```

## Step 5 — live smoke, quoted verbatim

**(d) the lighting-census tuple — and it independently confirms PLAN §8.1:**
```
TRUE_EXIT_smoke_census=0
census-probe OK  {"files":2521,"parked":371,"credited":2150,"titles":23184,"suiteTitles":6214}
  verdict: LIVE == FROZEN (no refreeze owed at this tree)
```

**(e) the stability rosters:**
```
TRUE_EXIT_smoke_rosters=0
  WAR_DEPTH_FLAGS 8 · ENGINE_WAVE_FLAGS 9 · ONE_REGEN_FLAGS 9
  LEGACY_PRESET_IDS 3 · CL0_PRESET_IDS 4 · WORLD_ALIVE_PRESET_IDS 3 · WAVE_DARK_PRESET_IDS 4
  WAR_DEPTH_FLAGS litSomewhere=8/8 · ENGINE_WAVE_FLAGS 9/9 · ONE_REGEN_FLAGS 9/9
rosters OK  presets=7 digest=324c877763cb
```

**(f) the REAL-birth fixtures, all seven presets:**
```
TRUE_EXIT_smoke_birth_all=0
  quiet_local            lit=  9 dark= 16 keys=37 roundTrip=yes hash=ab4d30ce2cd9
  realistic_regional     lit= 12 dark= 13 keys=37 roundTrip=yes hash=46919e4d4c53
  dramatic_campaign      lit= 35 dark=  9 keys=56 roundTrip=yes hash=75cfeb96d587
  static_campaign        lit=  1 dark= 24 keys=36 roundTrip=yes hash=2a81857ca062
  narrative_campaign     lit= 11 dark= 14 keys=37 roundTrip=yes hash=b1cff1c935db
  living_realm           lit= 31 dark= 12 keys=55 roundTrip=yes hash=b97fc24dcf25
  full_simulation        lit= 45 dark= 12 keys=70 roundTrip=yes hash=32728f513ff3
birth-fixtures OK  presets=7 refusals=0 digest=9a96fababf75
```
All seven round-trip to their own id. No preset falls through to `custom` at this tree.

**(g) the 52-tick pulse hash — the 52 MEASURED, not assumed, plus two controls:**
```
TRUE_EXIT_smoke_pulse_one=0
  realistic_regional     ticks=52 epoch=dark weeks=52 1105ms hash=08d459f37ee6
DETERMINISM CONTROL (re-run): resultHash 08d459f37ee654e1 both times; digest=149c2d5fae97 both times
DISCRIMINATION CONTROL:  quiet_local  ticks=52 epoch=dark weeks=52 1083ms hash=c6a0be732f3f
  -> two presets, two distinct hashes. The arm is not collapsed.
```

**STOP arm 1 — the preset catalog's eagerness, and it is CLEAR at the dock tip:**
```
TRUE_EXIT_smoke_eager=0
eager-probe  VERDICT: LAZY — clear
  source closure = 237 modules; catalog present = false
```

**(b) the per-preset certification STOP — MEASURED:**
```
TRUE_EXIT_smoke_overlay=1
  quiet_local LEAKS 33 · realistic_regional 33 · narrative_campaign 33 · static_campaign 34
  dramatic_campaign 14 · living_realm 15
  full_simulation  overlay keys=70 leaks=0  -> the ONLY clean receipt
preset-overlay: 7 preset(s), 6 with leaks
```
`whole-world-soak.mjs:299` is hardwired to `full_simulation`; `realm-scale-certification.mjs` spawns that
same soak (`:36`, `:209`). The only seam is `--rules-json`, and it leaks every `full_simulation` opt-in key
the target preset does not name. **Output (b) is a STOP for six of seven presets.** Cure = a `--preset` flag
on the soak, which is a CAR.

## Step 6 — dock state at the end (CONFIRMED)
`git -C $SC/lanePROSE2 status --porcelain` → **0 entries**. HEAD moved under this lane from
`4efce2e95` to `83c05bf4e` ("PROSE registers (last content-adjacent car)") — the chair's own landing,
observed and recorded, not acted on. No farm, temp file or scratch dir left in the dock or in `$TMPDIR`.
**Zero product bytes written. Nothing committed anywhere.**

## Step 7 — a third defect in my own kit, caught by anchor-count audit (CONFIRMED, fixed)
`presence-dump.mjs --mode exact` carried the splice anchor at **six** spaces of indentation; the tree's
`scripts/lib/observed-shape-corpus.mjs:662` carries **eight**. Measured occurrences: 0. The arm's own
count guard would have REFUSED rather than splicing nothing and reporting success — which is why this was
a five-minute fix and not a silent dead arm — but the arm would have been unusable. Corrected; the anchor
now matches exactly 1. The other three source anchors were audited the same way and each matches exactly
once (`vendorPdfLazy` vitest import 1; the census walker's and `campaignRuntimeLazy`'s both match the
`^import {…} from 'vitest';$` form). `vite.config.js` — which `vendorPdfLazy`'s pure region imports —
was verified to load under plain node (`EAGER_FIRST_PAINT_MODULES, ENGINE_SHARED_DOMAIN_EXCISIONS, default`),
and neither pure region does filesystem work at module load beyond a safe `existsSync`.

## Step 8 — (c) the OSR per-parent presence dump, SMOKED LIVE (CONFIRMED)
The quiet window did NOT open: the chair started `tests/lint/` and `economyStateProseDesk` gates and a
§898 golden re-record while this lane was waiting (probe log `$SC/lprobe/smoke/quiet-wait.log`, one clean
probe at 06:56:58 load1=2.92, then reset to busy=1). `presence-dump.mjs` is a single node process that
takes no gate mutex and runs no vitest, so per the owner's "a gate is not an agent — build during it" it
was run alongside, with the concurrent load recorded in the output:
```
LOAD AT START: 11.63 13.52 17.38  busy=13
presence-dump: driving buildObservedCorpus() — 4 seeds x 4 configs + 12 pulse intervals.
presence-dump: corpus built in 22s
presence-dump OK  parents=8558 shapes=1299 atOrAbove(MIN_ROWS=40)=337 below=962 digest=1746a60667f5
TRUE_EXIT_smoke_presence=0
```

### ⭐ This partly settles PLAN §9 item 1, which the plan called undeterminable
The plan says *"How many observed shapes cross `MIN_ROWS = 40`. A property of code nobody has written."*
That is true of the AFTER side. The BEFORE side — the whole point of §5.4's ordering — is now measured:

```
thresholds  MIN_ROWS 40 · ORIGIN_MIN_ROWS 8 · BASELINE_SCHEMA 16 · SCHEMA_PRESENCE 0.8
counts      parents 8558 · shapes 1299 · at-or-above MIN_ROWS 337 · below 962
corpusMeta  seeds 4 · configs 4 · generations 16 · pulseIntervals 12 · simulationFlagsLit 80
            steadingsMinted 12 · originCount 8558 · transitionCount 14490
```
`simulationFlagsLit = 80` independently reproduces PLAN §5.2's re-derived `DISCOVERED FLAGS = 80`.

**The wave's watch list — SEVEN shapes sit within five rows of the floor, two of them within two:**
```
  factionPatch            rows=38  needs 2 more
  resolutionContext       rows=38  needs 2 more
  belief_convergence      rows=36  needs 4 more
  casusReasons            rows=36  needs 4 more
  economic_strangulation  rows=36  needs 4 more
  subjects                rows=36  needs 4 more
  osr014:osr000           rows=35  needs 5 more
```
`c-presence-dump.json` is ~5.9 MB (8,558 parent rows with their key sets). That is the artefact the
chair diffs a post-lighting dump against to attribute every crossing key-by-key.

---

# ⭐ RETROVALIDATION ROW (Opus 5 lane → Fable 5.1 chair)

| # | what was judged (Opus) | what the FABLE CHAIR must re-derive | receipts by path | priority |
|---|---|---|---|---|
| R1 | **(b) is a STOP for 6 of 7 presets.** `whole-world-soak.mjs:299` is hardwired to `full_simulation`; `realm-scale-certification.mjs:36,:209` spawns that same soak; the `--rules-json` seam leaks 14–34 keys per preset. I REFUSED to pad the overlay to totality (it would certify a synthetic preset under a shipped preset's name). | Whether the wave accepts a `full_simulation`-only certification, or commissions the `--preset` CAR on `whole-world-soak.mjs`. **This is a product-byte edit and an owner/chair call, not a lane's.** | `$SC/lprobe/smoke/overlays/overlay-leak-report.json`, `$SC/lprobe/certify.sh` header | **HIGH — it gates output (b)** |
| R2 | **PLAN §8's "Size baseline … measuring act: the build" row names the wrong instrument.** `scripts/.size-baseline.json` is an eslint `max-lines` ratchet over `src/**`; a build moves nothing in it. The listing STOP's margin is `CLOSURE_BUDGET_BYTES = 1_048_000` at `tests/build/vendorPdfLazy.test.js:565`. | Confirm and amend the §8 row before any declaration quotes it. | `$SC/lprobe/closure-measure.mjs` header; `tests/lint/sizeBaseline.test.js` docblock | **HIGH — a declaration built on the wrong instrument is a false receipt** |
| R3 | **Half the POSITION 1 STOP needs no build, and it is already CLEAR.** `eager-probe` measures the catalog LAZY at `83c05bf4e` (source closure 237 modules, catalog absent), reusing `campaignRuntimeLazy.test.js`'s own walker. | Confirm the source closure is the right authority for "measures eager" (I judged it is — it is the assertion the tree itself makes at `:145`), and re-take it after L-DEFAULT. | `$SC/lprobe/smoke/eager.json`, `$SC/lprobe/eager-probe.mjs` | MEDIUM |
| R4 | **(c) reports `requiredKeys` (presence == 1.0), not `schemaKeys` (>= 0.8), in default mode**, because `frequencies`/`sets` are closure state the corpus does not export. I judged that stating the bound honestly beats printing a computed figure the instrument does not expose, and built `--mode exact` (a farm splice, refuses unless its anchor matches exactly once) for when the chair wants the true fractions. | Whether the default bound suffices for the `MIN_ROWS` attribution, or `--mode exact` should be the standing form. ⚠ `--mode exact` has NOT been executed — only its anchor was verified to match exactly 1. | `$SC/lprobe/presence-dump.mjs` header; `$SC/lprobe/smoke/presence.json` | MEDIUM |
| R5 | **The `env-shim.mjs` loader.** The store layer cannot be imported by a plain node process (`import.meta.env` undefined at `src/lib/supabase.js:17`). I judged a `load`-hook injecting an EMPTY env — which drives the product's own documented unconfigured arm — to be a shim, not a mock: nothing is replaced and no export is redefined. | Whether a REAL-birth fixture taken under an injected env is admissible as the wave's control. I believe yes (`isConfigured=false` is a shipped runtime state, and the rules path never touches the client), but it is a chair call because outputs (b), (f) and (g) all rest on it. | `$SC/lprobe/env-shim.mjs` header; `$SC/lprobe/smoke/birth-all.json` | **HIGH — three outputs rest on it** |
| R6 | **`pulse-hashes` drives ONE `interval: 'one_year'` and counts 52 ticks through `onTickObservation`**, refusing on any other count, rather than assuming the grain. Its fixture mirrors `observed-shape-corpus.mjs:785-830` verbatim rather than minting a new one; `whole-world-soak.mjs`'s richer `buildFixture` is unusable because that file runs a soak on import. | Whether a 2-settlement fixture is a sufficient pulse control, or the declarations need the soak's 4/30-settlement region. | `$SC/lprobe/pulse-hashes.mjs` header; `$SC/lprobe/smoke/pulse-one.json` | MEDIUM |
| R7 | **`census-probe.mjs` is a SECOND HOME of the chair's `$SC/chair-tools/lighting-probe.mjs` idiom.** I judged self-containment worth the duplication (a sibling scratchpad was deleted with eight live docks inside) and refused a "use the chair's if present" fallback. Its measured tuple `2521/371/2150/23184/6214` reproduces PLAN §8.1 exactly and reads LIVE == FROZEN. | Whether the duplicate home is acceptable, or the kit should depend on `chair-tools/`. | `$SC/lprobe/smoke/census.json` | LOW |
| R8 | **Four chair-claims in the brief were wrong** (plan path, OSR presence file, size-baseline instrument, soak preset flag) and are corrected in `README.md`'s "Four corrections". | Confirm each correction before any declaration cites the original claim. | `$SC/lprobe/README.md`, and Step 1 of this receipt | **HIGH** |

**Seat:** Opus 5 — Fable-unvalidated. **Lane:** L-PROBE-KIT.
**Nothing committed. Zero product bytes. Dock porcelain 0 at start and at end.**
