# EM-R0b PRE-PROOF — LANE RESUME NOTE

**Written 2026-09-20 07:2x EDT by the Opus PRE-PROOF lane (session a9df403c), at `141a1d775`.**

## ⭐ THIS LANE IS NOT PAUSED AT THE GATE. IT IS COMPLETE.

Every step of `briefs/LANE-EM-PREPROOF.md` was finished with **plain `node` probes only**, which the
launch declares ungated. No vitest, eslint CLI, tsc, build or npm script was run, and the pre-proof
seat runs no gate by its own charter ("You implement nothing and run no gate"). **The lane owes the
gate nothing and the chair should not hold a slot for it.**

The deliverables are final:

- `EM-R0b.md` — the pre-proofed packet, version 4, `DRAFT`, header stamped **READY-able at `141a1d775`**
- `EM-R0b.manifest.json` — re-parsed and valid after editing
- `EM-R0b.evidence.md` — V3-1…V3-8 untouched, **P-1…P-12 appended**
- `EM-R0b.preproof.report.md` — the report

---

## ⚠ ONE OPTIONAL GATED RUN — the chair's call, NOT a blocker

Finding A (the lighting delta `titles +8` → `titles +7`) is derived from the walker's own counting
rule read at source plus §9's test homes. It is sound and I would ship on it — the census is
re-derived by the chair at the terminal anyway (§7), so `+7` versus `+8` costs one line of re-reading
there, never a re-freeze.

If the chair wants it **EXECUTED** before promotion, this is the only run that would do it. It must
happen in a **throwaway copy**, never on a tracked tree (CURE-G's idiom), because it plants a stub
file:

```sh
# 1. throwaway copy — NEVER a tracked worktree
SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad
rm -rf "$SP/throwaway-r0b-census" && cp -R "$SP/read-tip-141a1d775" "$SP/throwaway-r0b-census"

# 2. plant a SEVEN-`it` stub under ONE literal describe, in the packet's own registration shape:
#    straight-line literal `it`s, no .each, no loops, no nesting, no conditionals, and
#    ⛔ never binding `it`, `test` or `describe` as a variable or parameter.
#    Path: tests/domain/recordInvariants.test.js

# 3. the census, through the SHARED tier, worker-capped, ONE directory per invocation
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/sovereigntyLightingContract.walker.test.js
```

**Read it as:** the census red must print a tuple whose `titles` is exactly **7** above the frozen
`25052`, `files` **1** above `2653`, `credited` **1** above `2270`, `suiteTitles` **1** above `6680`,
and `parked` UNCHANGED at `383`. A `parked +1` instead of `credited +1` means the stub tripped a
registration reason — run `parkReasonsFor` on it and read what it prints (never guess the cause).

⚠ **`gate-mutex.sh` GIVES UP AFTER 40 POLLS AND EXITS 0** — a gate line with **no printed test
count** DID NOT RUN. The env prefix above is the long-poll spelling; quote the printed count.

⛔ Delete `$SP/throwaway-r0b-census` afterwards. Nothing about this run may touch
`$SP/read-tip-141a1d775`, `$SP/consist`, `$SP/slot-2`, any `$SP/lane-*`, the kit or the ledger.

---

## The BUILD lane's gated commands, for when EM-R0b is dispatched

Not this lane's to run — recorded in order so the build lane inherits them. Sources: the packet's
§10, with the `tests/lint` whole run added at this pre-proof.

```sh
npx eslint src/domain/edit/recordInvariants.js src/domain/edit/recordInvariantMeta.js \
  src/domain/edit/recordInvariantFlags.js tests/domain/recordInvariants.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/recordInvariants.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/build/domainGeneratorsBoundary.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js

# ⭐ ADDED AT THE PRE-PROOF — the directory the new test file opts into.
# EXPECTED RED on the lighting census interior ONLY; every other arm must be green.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint

# ungated
node scripts/check-observed-shape-readers.mjs --report
node scripts/implementation-packets.mjs validate
npm run check:packet -- EM-R0b
npm run check:tail
```

⛔ `tests/lint` whole is a §10 VERIFICATION command, **not** a sealed `checks` row — the census arm is
expected to red on its interior and a guaranteed-red suite inside the sealed chain fails the gate.
