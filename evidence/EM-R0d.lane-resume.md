# EM-R0d PRE-PROOF — GATED COMMANDS, IN ORDER (resume with "the gate is yours")

⛔ **RULE Q1 FIRST.** If the chair refuses `src/domain/prose/holderTable.js` as a fourth production row, the
packet splits and steps 3–4 below change. Nothing here should be spent before that ruling.

⛔ Every ungated step of this lane is DONE (evidence F-1…F-16). Nothing below is needed to promote the packet —
these are CONFIRMATION runs the pre-proof would have executed if the gate had been free, each one re-proving by
runner what this lane proved with the walkers' own exported logic under plain `node`.

`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`
Run from `$SP/read-tip-141a1d775` (READ-ONLY, shared with the EM-R0a lane — **never write there**; if a run
needs a writable tree, cut a fresh detached worktree at `141a1d775` first).

---

### 1 — the lighting walker whole, confirming F-12's classify verdicts by runner

```sh
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/sovereigntyLightingContract.walker.test.js
```
Expect: GREEN at the frozen tuple `2653 · 383 · 2270 · 25052 · 6680`. ⚠ A gate line with no printed test count
DID NOT RUN (`gate-mutex.sh` gives up after 40 polls and exits 0).

### 2 — the wiring-census walker whole, confirming F-7's CITE arm is green TODAY (the red is the packet's)

```sh
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/proseWiringCensus.walker.test.js
```
Expect: GREEN, including SEAM car 5b's `'⭐⭐ EVERY MAPPING ROW IS CITED TO A PRODUCER THE TREE STILL CARRIES'`
and the four-`generator-write` arm at `:1685`. A red here is a STANDING red, not this packet's.

### 3 — the two files the pre-proof newly convicted, green at the base (red-first evidence for the build)

```sh
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/copy/voiceMechanics.test.js
```
```sh
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/components/dossierLabelCase.test.jsx
```
Expect both GREEN at `141a1d775`, with their printed counts recorded — that is the "before" half of the build
lane's red-first receipt for F-5 and F-6.

### 4 — the three files §7 already cured, green at the base

```sh
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/generalStateProseDesk.test.js tests/domain/powerStateProseDesk.test.js \
  tests/domain/defenseStateProseDesk.test.js
```
```sh
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/ui/compendiumFoodSecurity.test.jsx tests/ui/compendiumPower.test.jsx
```
Expect: GREEN. `generalStateProseDesk` should print 70 `it` titles' worth of arms (F-12 measured 70/20).

### 5 — the layering ratchet, A8's proof

```sh
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/build/domainGeneratorsBoundary.test.js
```
Expect: GREEN at 4 files / 5 edges.

### 6 — the packet validator (ungated by the mutex, but it reads the placed manifest)

```sh
node scripts/implementation-packets.mjs validate
```
⛔ Run only AFTER the chair has placed the version-3 manifest. Expect: no `duplicate change path across packets`
for any of the twelve rows (F-11 proved all twelve free across 193 entries and the kit).

---

⛔ **NOT run here, and not this lane's:** `npm run build`, the per-module attribution, `VERIFY_DIST=1` on either
build test file, the ceiling re-mint, `npm run check:packet`. Those are §8 step 9's and belong to the BUILD lane
after the chair promotes.
