# TOOL-25 — LANE RESUME NOTE (rev 2, after the chair's rulings on my three calls)

Branch `tool-25-nul-walker-2026-09-20` at base **`578272a99`**. Written 2026-09-20 13:27 EDT.
`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`
`L="$SP/lane-tool-25"` · `S="$SP/lane-tool-25-scratch"`

⛔ **THE FIRST ACT ON RESUME IS THE CHERRY-PICK, NOT A GATE.** Everything below assumes
DOC-4 is in this branch's history. Until it is, the tree-wide NUL arm reds on exactly one
path and nothing else.

## STAGED — five files, explicit pathspec; `git status --short` shows these and nothing else

```
M  .gitattributes                                 +5  -0    *.glb binary
M  scripts/hazard-registry.json                   +6  -5    HZ-NUL re-counted
M  scripts/prose-wave-gate.mjs                    +5  -1    the inherited key separator
M  src/domain/worldPulse/supplyCompleteness.js  (Bin in THIS diff only)  the memo key separator
M  tests/lint/controlBytes.test.js               +289 -57   the widened pin
```

Goldens byte-identical throughout: `7177cd6e…` / `921c51cf…`.
No untracked file anywhere in the worktree. Counterforce target pristine at `c3ac36aa…`.

## WHAT CHANGED SINCE REV 1 (the chair's three rulings, all applied)

1. **The EM-P2.md exemption row is GONE and the register is EMPTY, ceiling 0.** Its
   "must name a ruled act" guard and the shrink ratchet are kept for the future, and because
   an empty register makes that validator vacuous, it is now exercised BY INJECTION —
   `exemptionDefects(entries, tracked)` is exported and driven with three synthetic rows
   (no ruled act → convicted; ruled act → cleared; untracked path → convicted). Verified
   out-of-band, all three exact:
   `no-act ["docs/example.md: names no ruled act that removes it"]` · `ruled []` ·
   `ghost ["docs/ghost.md: is not a tracked path"]` · `empty []`
2. **The numstat arm asserts zero** as well as printing its census. Unchanged from rev 1.
3. **`scripts/hazard-registry.json` HZ-NUL rewritten** (instances 7 → 10; the enforcer note's
   "it caught all 7" claim withdrawn by execution; a third trigger naming the tool-parameter
   vector with the escapes spelled in WORDS; the upgrade path carrying the cure ladder).
   The registry's own gate passes: `node scripts/check-hazard-registry.mjs` → **EXIT=0**,
   `[hazard-registry] OK — 29 class(es): MACHINERY 13, PARTIAL 11, DOCUMENT 5, ACCEPTED 0.
   DOCUMENT 5/5, OWED 16/18 (shrink-only), MACHINERY 13/9 (grow-only), floor 27.`
   Counters unmoved — status stays MACHINERY, so no baseline moves.
4. **Both untracked scratch carriers cured** (`measure.mjs`, `verify-scope.mjs`, 4 raw NULs
   each → 0, still run correctly). They were already outside the worktree, but the byte is
   gone rather than merely out of reach.

## THE GATED BATCH, IN ORDER

### Step 0 — DOC-4 (ungated, but FIRST)

```sh
cd "$L"
git cherry-pick <DOC-4-sha>            # docs-only; the chair says it applies clean
git log -1 --stat                      # EXPECT: only docs/implementation/packets/settlement-editor/EM-P2.md
node -e 'const b=require("node:fs").readFileSync("docs/implementation/packets/settlement-editor/EM-P2.md");console.log("NULs",b.filter(x=>x===0).length)'
#   EXPECT: NULs 0   ⛔ if it prints anything else, STOP — do not run the gate
```

### Batch A — RED-FIRST COUNTERFORCE (its own batch; plants into a TRACKED file, restores byte-exact)

```sh
cd "$L"
node "$S/plant.mjs" "$S/anonForkSalt.pristine.js"
#   EXPECT pristine sha256 c3ac36aa618094787a0ac26014b0032821c98b3dbf856cd6479a1a959eedcbca
#   EXPECT the arm to report src/lib/anonForkSalt.js:232:22  raw 0x00 (NUL) at byte offset 12266

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/controlBytes.test.js

node "$S/restore.mjs" "$S/anonForkSalt.pristine.js" c3ac36aa618094787a0ac26014b0032821c98b3dbf856cd6479a1a959eedcbca
git status --short          # EXPECT: exactly the five staged M rows
```

⛔ A red-first that comes back GREEN is a STOP, not a pass (the zsh false-green law): confirm
`git status --short` shows `src/lib/anonForkSalt.js` dirty before believing any result.

### Batch B — GREEN

```sh
cd "$L"
# tests/lint WHOLE — mandatory (lane law 13:08, and my change lives here). Covers
# negativeAssertionAnchor, mutationCoverageManifest, contractTestAntiVacuity,
# hazardRegistryFailClosed (I edited the registry) and proseWaveGate.walker.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint

# the src/ file I changed — its three consumers, one directory, explicit files
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/tradePrimitives.w0.test.js tests/domain/tradeWar.test.js tests/domain/warClusterWC1.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/copy/voiceMechanics.test.js

# eslint BARE — the shared tier refuses a command declaring no worker cap
npx eslint tests/lint/controlBytes.test.js scripts/prose-wave-gate.mjs src/domain/worldPulse/supplyCompleteness.js
```

### THE ONE EXPECTED RED — the lighting census, and it is not mine to cure

`tests/lint` whole will red on `sovereigntyLightingContract.walker.test.js`: I add **5 `it`
titles to an existing file** (4 → 9; 1 `describe`, unchanged). No new file, no parked file.

| | files | parked | credited | titles | suiteTitles |
|---|---|---|---|---|---|
| FROZEN at dispatch | 2664 | 359 | 2305 | 25501 | 6812 |
| **MY DELTA (derived; the walker measures it)** | **+0** | **+0** | **+0** | **+5** | **+0** |
| expected measured | 2664 | 359 | 2305 | 25506 | 6812 |

⚠ DOC-4 is docs-only and moves no title, so the tuple above holds after the cherry-pick.
The walker asserts five figures in order and stops at the first miss, so it should reach
`titles` and stop. **Record what it prints; never refreeze.** Anything else red is a STOP.

## VERIFIED OUT-OF-BAND (node, ungated — so the gate is spent on proof, not discovery)

Every population the arms assert, measured on the real tree:

```
TRACKED 6787 (>6000) · SUBJECTS 6565 · STRICT 5063 (>4000) · REST 1502 (>800) · gitBinary 208 (>100)
REST trees reached: (root) .claude .github api docs e2e foundry-module mcp-server public schema scripts supabase tools
svg in SUBJECTS 132 (>100) · png in SUBJECTS 0 · glb in SUBJECTS 0
TEXT SUBJECTS GIT CALLS BINARY: 0    STRICT whole-C0 violations: 0
REST NUL violations: 1  docs/implementation/packets/settlement-editor/EM-P2.md @40219 0x0   ← DOC-4 cures exactly this
scan wall clock: 3510 ms   (brief's bar 5 s; STOP at 15 s)
```

Behaviour proof for the two separator conversions, both byte-identical:
- the key path itself (`scopedWalkOf` driven with spine findings; dedupe counts 2/2/1 plus one
  owned negative control) — `d173f55c…` before and after. The CLI arm never reaches that line,
  so this probe is the real proof.
- the CLI run (`--arm draft --variety 1`), timestamp-normalized — `9bf56446…` before and after.
- git's own classifier: `supplyCompleteness.js` `-  -` → `210  0`; index binary blobs 209 → 208.

## AFTER THE BATCH — COMMIT (only if Batch A red-then-restored and Batch B green)

`git commit -- .gitattributes scripts/hazard-registry.json scripts/prose-wave-gate.mjs src/domain/worldPulse/supplyCompleteness.js tests/lint/controlBytes.test.js`

Subject: `TOOL-25: the control-byte pin scopes to every tracked file, and the estate's last two raw-NUL separators are converted`

Body carries: every count line; the counterforce offset; the goldens; the lighting tuple and
delta; the HZ-NUL re-count with its basis; the judgment calls; trailer
`Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`. Never amend.

⚠ **`git diff --cached` shows `Bin 9116 -> 9537 bytes` for `supplyCompleteness.js`** — correct
and one-time: the OLD side (HEAD) carries the NUL, so git calls the pair binary. The NEW blob
is text, proved three ways (numstat `210 0` against the staged blob, `git cat-file` 0 NULs,
index binary count 209 → 208). **This is the last diff of that file that will ever read "Bin".**

## NOTICED AND NOT TOUCHED — each specific enough to slot

1. ⛔ **The real gap FIX-P1b exposed is PROCEDURAL and this commit does not close it.** `src/`
   was always walked; the 8th instance shipped because the lane ran three named `tests/lint`
   files instead of the directory. The lane law of 13:08 now says `tests/lint` WHOLE before
   every commit touching src/ or tests/ — but nothing MEASURES compliance. **Slot:** its own
   TOOL lane. This is the run-17/18/19 family's root cause; I widened reach, not discipline.
2. **`public/map/libs/jszip.min.js` carries C0 bytes 0x01–0x06** (vendored minified lib, no
   NUL). Lawful under the ruling — the whole-C0 rule stays at `src`/`tests`. Recorded so nobody
   later "tidies" the wide arm into whole-C0 and reds the terminal.
3. **`SNAPSHOT_MEMO`'s key could drop its separator entirely** (cure ladder rung 1,
   `JSON.stringify([supplierId, commodityId])`). Not done: that CHANGES the key string, and the
   ruling was the behaviour-identical conversion. **Slot:** only if the separator is to go as a
   class, and then it is a behaviour change owing its own proof.
4. **A pipeline masks a gate's exit code.** `node scripts/check-hazard-registry.mjs | tail -5`
   printed `EXIT=0` while the gate was FAILING CLOSED on unparseable JSON — the shell reports
   `tail`'s status, not the script's. I caught it only because the message said so. Same family
   as the mutex's no-count law. **Slot:** worth a line in LANE-PARALLEL beside that law.
5. **`.gitattributes` declared no `*.glb`** though git detected all 25 as binary. Fixed here;
   the general lesson (detection is not a contract, declaration is) may apply to other asset
   types as the estate grows.
