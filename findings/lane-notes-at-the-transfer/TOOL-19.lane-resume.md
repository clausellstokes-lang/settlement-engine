# TOOL-19 — LANE RESUME NOTE (the gated batch, in order)

Stamped `Sun Sep 20 09:27:34 EDT 2026`. Lane worktree
`$SP/lane-tool-19`, branch `tool-19-retiree-seal-2026-09-20`, cut at `c127cdfb2`.
`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`
`S="$SP/lane-tool-19-scratch"`

**Every ungated act is DONE.** The three states and five counterforces are measured
(`TOOL-19.evidence.md`, `states-BEFORE.txt`, `states-AFTER.txt`, `probe-arm.txt`). Nothing
is staged: the red-first swaps the validator file mid-window, so a blob staged now would go
stale. Every commit below uses `git commit -- <explicit paths>`, which stages its own files.

## Tree state at the pause

```
 M docs/implementation/PACKET_STANDARD.md
 M scripts/implementation-packets.mjs
 M tests/scripts/implementationPackets.test.js
```

| file | sha-256 | role |
|---|---|---|
| `$S/implementation-packets.BASE.mjs` | `59a995f605b9d15fd6605e006ef37cde7f8d57633d5b4c3580e707a56e9780c5` | HEAD's blob, kept for reference only |
| `$S/implementation-packets.CURED.mjs` | `215db74c16f0ad58b5196da2e99920c12b910dde3498cd72de05e2bafa8c5d56` | the cure — **this is what the tree holds now** |
| `$S/implementation-packets.MUTANT.mjs` | `dface5cc6737afe2c59534ee071b59dde6ea0311de60c3f9d7b2f297f6219b7d` | the cure + ONE line blinding `readDispatchSeal` |

⛔ **THE RED-FIRST IS A PLANTED MUTANT, NOT THE BASE FILE, AND THAT IS DELIBERATE.** The
base file does not EXPORT `readDispatchSeal` or `SEAL_ENVELOPE_SCHEMA_VERSION`, so the new
arm's `import` would fail to LINK and every one of the file's titles would die together —
a red that proves the exports are new, not that the behaviour is. The mutant keeps the
module's shape and restores the pre-cure BEHAVIOUR (`readDispatchSeal` returns null), so
exactly ONE title reds and the counts stay comparable. Proved ungated: the arm's assertions
run green against the cured tree (`probe-arm.txt`) and throw at the seal read against the
mutant tree.

Goldens at the pause, to be re-read identical at the end:
`7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e` generator-golden-master
`921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41` dossier-prose-manifest

## THE BATCH

Prefix every vitest line with the two exports INLINE. A line with no printed test count DID
NOT RUN — re-run it, never believe it.

### B0 — RED-FIRST (the mutant): exactly ONE title reds

```sh
cd "$SP/lane-tool-19"
cp "$SP/lane-tool-19-scratch/implementation-packets.MUTANT.mjs" scripts/implementation-packets.mjs
shasum -a 256 scripts/implementation-packets.mjs          # MUST print dface5cc6737afe2c…
git status --short                                        # MUST still be the same three files
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/scripts
```

EXPECT: red on exactly `⭐ lets one live seal license the burn of the retiree its own packet
ordered burned`, every other title passing. ⛔ If it comes back GREEN that is a STOP, not a
pass: re-check the sha above and that `git status --short` names the validator.

### B1 — the cure restored, the same directory green

```sh
cp "$SP/lane-tool-19-scratch/implementation-packets.CURED.mjs" scripts/implementation-packets.mjs
shasum -a 256 scripts/implementation-packets.mjs          # MUST print 215db74c16f0ad58b5…
git status --short                                        # MUST be the same three files
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/scripts
```

EXPECT: green. The count must equal B0's total, with the one title passing instead of
failing — that pair IS the "identical counts plus your new titles" receipt.

### B2 — `tests/lint` WHOLE, minus the lighting walker (09-20 addendum: always)

```sh
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint --exclude='**/sovereigntyLightingContract.walker.test.js'
```

Covers `negativeAssertionAnchor.walker` and `mutationCoverageManifest` (both named
instruments) plus every other walker governing `tests/`. ⚠ If `--exclude` dies in a startup
error with NO count (the `--reporter=basic` shape, FIX-P5), re-run the mutex line with the
two named instrument files spelled explicitly instead and say so.

### B3 — the voice walker

```sh
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/copy/voiceMechanics.test.js
```

### B4 — the lighting walker, ONCE, alone. EXPECTED RED. ⛔ NEVER REFREEZE.

```sh
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint/sovereigntyLightingContract.walker.test.js
```

Frozen at `2656 · 383 · 2273 · 25074 · 6684` (`tests/lint/.lighting-census-baseline.json`,
register at `c33446830`). PREDICTED delta **+0 files / +0 parked / +0 credited / +1 title /
+0 suiteTitles** — one new `it`, no new file, no new `describe`. The walker asserts its five
figures IN ORDER and throws at the FIRST miss, so record only what it actually evaluated.

### B5 — eslint, BARE (never through the mutex; the shared tier refuses it)

```sh
npx eslint scripts/implementation-packets.mjs tests/scripts/implementationPackets.test.js
```

### B6 — the two commits, by explicit pathspec

⚠ The pre-commit hook runs `eslint --fix` on staged js/mjs and, because commit 2 touches
`docs/implementation/**`, `scripts/validate-packets-staged.sh`. If the hook rewrites a file,
re-run B1/B5 and say so. ⛔ Never `git add -A`/`-u`/`.`; never `--no-verify`; never amend.

Commit 1 — the proof (⛔ RED at this commit by construction; the pair composes together):

```sh
git commit -- tests/scripts/implementationPackets.test.js
```
Subject: `TOOL-19: pin the sealed-burn exemption and its five counterforces in the validator's test home`

Commit 2 — the cure and the standard:

```sh
git commit -- scripts/implementation-packets.mjs docs/implementation/PACKET_STANDARD.md
```
Subject: `TOOL-19: the retiree rule learns the seal, so a sealed build may lawfully burn its own retiree`

Both bodies carry: every count line from B0–B5 verbatim; the goldens' hashes; the lighting
tuple and the measured delta; the judgment calls (the `onNote` sink over a third return key;
ancestor over equality; the four fences; the red-first mutant over the base file; the
deliberately red commit 1). Trailer `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`;
keep any second attribution line the harness adds.

### B7 — the closing receipts

```sh
git show --stat HEAD; git show --stat HEAD~1      # each names ONLY this lane's paths
git status --short                                 # empty
node scripts/implementation-packets.mjs validate; echo "EXIT=$?"   # `valid: 194 packets (1 READY)`, exit 0
shasum -a 256 tests/fixtures/generator-golden-master.json tests/fixtures/dossier-prose-manifest-golden.json
git log --oneline -3
```

Then finish `$SP/lane-tool-19-scratch/TOOL-19.receipt.md` with the real counts and report.

## What remains after the batch

Nothing but B6/B7 and the receipt. No src/ byte was written, no golden moved, no register
was refrozen, the three prose-manifest recorder files were never opened.
