# TOOL-25 — RECEIPT (complete; gate run 2026-09-20 13:41–13:52 EDT)

## THE SHAS

| Commit | Role |
|---|---|
| **`f1367909a07cbb2dfe514ec3867f20f456b3ed90`** (`f1367909a`) | ⭐ **MINE — the only commit the chair composes from this lane.** 5 files, +305/−63 |
| `fd885eb96ac53b81614832ee32a2b5e1525a0ec3` (`fd885eb96`) | DOC-4, **cherry-picked from the chair's `6290f7a16f79694b0e76273b51826536250acfc4`**. My branch carries it; the chair composes DOC-4 into the slot **from its own sha `6290f7a16`**, never from mine. |

Branch `tool-25-nul-walker-2026-09-20`, base **`578272a99`**. `git status --short` empty.
`git show --stat f1367909a` names exactly the five paths below and nothing else.
The pre-commit hook rewrote nothing (`git diff HEAD --stat` empty after the commit).

```
 .gitattributes                              |   5 +
 scripts/hazard-registry.json                |  11 +-
 scripts/prose-wave-gate.mjs                 |   6 +-
 src/domain/worldPulse/supplyCompleteness.js | Bin 9116 -> 9537 bytes
 tests/lint/controlBytes.test.js             | 346 +++++++++++++++++++++++-----
```

⛔ **ORDERING DEVIATION, RECORDED.** The chair's step 0 was the cherry-pick, then the gate,
then the commit. `git cherry-pick` **refuses a dirty index** (`error: your local changes would
be overwritten by cherry-pick`, EXIT=128) and `git stash` is forbidden in this shared tree, so
the order had to be commit → pick → gate. eslint ran BARE *before* the commit so no commit
object was created over a lint red. The gate's counts are below; a red would have been carried
by a follow-up commit, never an amend. Consequence: in my branch DOC-4 sits **after** my commit
rather than ahead of it. Composition is by sha, so this is cosmetic.

## OUTCOME

**There is no longer a single raw NUL byte in any tracked text file in the estate.** Measured
after the pick, over every text extension:

```
git grep -l -P '<a backslash-x-00 escape, spelled in words>' -- '*.js' '*.jsx' '*.mjs' … '*.txt'
(no output — ZERO carriers)
```

## THE COUNTERFORCE — RED FIRST, WITH THE OFFSET, RESTORED BYTE-EXACT

Planted into a TRACKED file (`src/lib/anonForkSalt.js`, the file whose own NUL opened this
class this morning), the byte built with node, a pristine backup taken first. The plant
**predicted** the arm's report before the run:

```
  pristine sha256 c3ac36aa618094787a0ac26014b0032821c98b3dbf856cd6479a1a959eedcbca  bytes 12162  NULs 0
  PLANTED:        0139973023ec53440e39a22784dc8d0d93be51121024b153fd22f337999cb505  bytes 12270  NULs 1
  the arm MUST report: src/lib/anonForkSalt.js:232:22  raw 0x00 (NUL) at byte offset 12266
```

False-green guard satisfied before believing the run: `git status --short` printed
` M src/lib/anonForkSalt.js`.

**The arm reported exactly that, byte for byte:**

```
AssertionError: Raw control byte(s) found in source (1):
src/lib/anonForkSalt.js:232:22  raw 0x00 (NUL) at byte offset 12266
```

| Run | Count line |
|---|---|
| `tests/lint/controlBytes.test.js`, planted | **`Tests  1 failed \| 8 passed (9)`** |

The report-only census printed on that same failing run, proving it survives the default
reporter (the FIX-C2 law) and prints even when a sibling arm fails:

```
[controlBytes] tracked=6787 textSubjects=6565 strict=5063 rest=1502 gitBinary=208 textSubjectsClassifiedBinary=0
```

Restoration proved byte-exact, not assumed:

```
restored src/lib/anonForkSalt.js
  sha256   c3ac36aa618094787a0ac26014b0032821c98b3dbf856cd6479a1a959eedcbca
  expected c3ac36aa618094787a0ac26014b0032821c98b3dbf856cd6479a1a959eedcbca
  NULs     0
✅ byte-exact restoration confirmed
```

`git status --short` empty afterwards.

## GREEN — EVERY COUNT LINE, SHARED TIER, ONE DIRECTORY PER INVOCATION

| Run | Count line |
|---|---|
| `tests/lint` **WHOLE** | **`Test Files 1 failed \| 174 passed (175)`** · **`Tests 1 failed \| 2822 passed (2823)`** — the single red is the lighting walker, below |
| `tests/domain/tradePrimitives.w0.test.js` + `tradeWar.test.js` + `warClusterWC1.test.js` | `Test Files 3 passed (3)` · **`Tests 39 passed (39)`** |
| `tests/copy/voiceMechanics.test.js` | `Test Files 1 passed (1)` · **`Tests 30 passed (30)`** |
| `npx eslint` (3 changed source files, **BARE**) | exit 0, no output |
| `node scripts/check-hazard-registry.mjs` (ungated) | **EXIT=0** — `OK — 29 class(es): MACHINERY 13, PARTIAL 11, DOCUMENT 5, ACCEPTED 0. DOCUMENT 5/5, OWED 16/18 (shrink-only), MACHINERY 13/9 (grow-only), floor 27.` |

`tests/lint` whole covers, all green: `controlBytes` (9/9 restored),
`negativeAssertionAnchor`, `mutationCoverageManifest`, `contractTestAntiVacuity`,
`hazardRegistryFailClosed` (my registry edit), and `proseWaveGate.walker` (the walker of my
other changed file). Duration 557.55 s.

**GOLDENS** — byte-identical before the first edit and after the last:
`7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e` ·
`921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41`

## LIGHTING CENSUS — MEASURED, NEVER REFROZEN

The walker asserts **files → parked → credited → titles → suiteTitles** in that order and stops
at the first miss. It reached the FOURTH, so the first three were **executed and passed at the
frozen values**; the fifth was never evaluated.

```
AssertionError: the live TEST-title count moved from SP-C's measured 18,471 …
expected 25506 to be 25501
```

| Figure | Frozen | Measured | Status | My delta |
|---|---|---|---|---|
| files | 2664 | 2664 | ✅ evaluated, passed | **+0** |
| parked | 359 | 359 | ✅ evaluated, passed | **+0** |
| credited | 2305 | 2305 | ✅ evaluated, passed | **+0** |
| **titles** | **25501** | **25506** | ⛔ **the stop** | **+5** |
| suiteTitles | 6812 | — | NOT EVALUATED | +0 (derived) |

**+5 titles is exactly this lane's addition**: `tests/lint/controlBytes.test.js` goes 4 `it` → 9
`it`, one `describe` unchanged, no new file, none parked. DOC-4 is docs-only and moves no title.
**Not refrozen — that is the train's terminal act and the chair's.**

## REGISTERS THAT MOVE WHEN THIS IS COMPOSED

- **Lighting census**: titles **+5**; everything else +0.
- **mutation-coverage manifest**: **no movement.** `tests/lint/controlBytes.test.js` already
  carries `{"kind": "uncovered"}` and stays `uncovered`; no file was created or renamed.
  `mutationCoverageManifest` green inside `tests/lint` whole.
- **hazard registry**: HZ-NUL `instances` 7 → 10; status stays MACHINERY, so
  `documentBaseline` 5/5, `owedBaseline` 16/18, `machineryFloor` 13/9 and `classFloor` 27 are
  all unmoved. Gate exits 0.
- **`.gitattributes`**: `*.glb binary` added. No working-tree churn (git already detected all
  25 as binary; the declaration only makes it a contract).
- **numstat classification**: `src/domain/worldPulse/supplyCompleteness.js` moves from
  git-binary to git-text. Index binary-blob count **209 → 208**.

## THE TWO CONVERSIONS, PROVEN BEHAVIOUR-IDENTICAL BY EXECUTION

The chair required the script's output byte-identical. Measured two ways, because one alone
would have proved nothing:

1. **The CLI arm never reaches the changed line** (`--arm draft --variety 1`: every pool is
   NOT-EXECUTABLE, so `scopedWalkOf` sees no spine finding and the key is never built). A probe
   therefore drives `scopedWalkOf` directly with synthetic spine findings — dedupe counts
   **2 / 2 / 1** across three inherited rows plus one owned modifier finding as the negative
   control. Output sha256 **`d173f55c48b6c6fa98f6bc69419e60aee0d80aa12cd4a2423960c80dcd5af86d`
   before and after**, `cmp` byte-identical. Key identity is what the counts depend on, so a
   separator whose identity had moved would have split or merged those rows.
2. **The CLI run itself**, timestamp-normalized:
   **`9bf564465aa0b04f849fcc55883bb567f38e8adbe16ad3dc4236fc0b536e4ae7` before and after**.
3. **Git's own classifier** on the `src/` cure: numstat `-  -` → **`210  0`**; the staged blob
   carries **0** NUL bytes; index binary count 209 → 208.

⚠ `git diff --cached` showed `Bin 9116 -> 9537 bytes` for `supplyCompleteness.js` — correct and
one-time, because the OLD side (HEAD) carried the NUL. **This is the last diff of that file that
will ever read "Bin".**

## THE SCOPE, MEASURED

```
tracked 6787 · text subjects 6565 · strict (src+tests) 5063 · rest 1502 · git-binary 208
rest reaches: (root) .claude .github api docs e2e foundry-module mcp-server public schema scripts supabase tools
svg in subjects 132 (declared `text eol=lf`) · png 0 · glb 0
text subjects classified binary: 0 · whole-C0 violations: 0 · tree-wide NUL violations: 0
byte scan wall clock 3,510 ms over 123.8 MB   (brief's bar 5 s; STOP at 15 s)
```

## WHAT THE MEASUREMENT CORRECTED IN THE DISPATCH

1. **`src/` was ALWAYS walked.** The dispatch supposed `src/lib/anonForkSalt.js` was a root
   miss. It was not: `SCAN_DIRS = ['src','tests']`, every extension. The 8th instance reached
   review because **that lane ran three named `tests/lint` files and never the directory
   whole** — the run-17/18/19 family, not a scope gap.
2. **`git grep -E` does not undercount NULs, it returns the WRONG SET.** Proved on a throwaway
   repo: `-E` matched the file containing the four-character *text* and **missed the raw byte**;
   `-P` matched the byte and only it. Sharper than the `\s` law.
3. **Git classifies binary from the first ~8 KiB only** — `supplyCompleteness.js` (6,520) was
   called binary; `prose-wave-gate.mjs` (39,627) and `EM-P2.md` (40,219) were called text with
   the byte present. The numstat census is the shallow half; the byte scan is the deep half.
   Both are in the pin, and the header records why neither replaces the other.
4. **The class recurs through TOOLING, not typing** (the chair's addendum 105). While widening
   the pin I planted **four** raw NULs into it by passing escapes through the Write tool's
   JSON-encoded `content` — git plumbing wants a NUL record separator and every one was typed
   as an escape. The pin's own scan caught them before the commit. Two untracked scratch
   scripts caught the same accident and were **cured, not kept**.

## NOTICED AND NOT TOUCHED — each specific enough to slot

1. ⛔ **The procedural gap is NOT closed by this commit.** The lane law of 13:08 now says
   `tests/lint` WHOLE before every commit touching `src/` or `tests/`, but **nothing measures
   compliance** with it against a lane's own batch list. That is what let the 8th instance
   through a walker that already governed its directory. **Slot:** its own TOOL lane.
2. ⛔ **A pipeline masks a gate's exit code.** `node scripts/check-hazard-registry.mjs | tail -5`
   printed `EXIT=0` while the gate was FAILING CLOSED on JSON I had just broken — the shell
   reports `tail`'s status, not the script's. I caught it only because the text said "failing
   closed". Same family as the mutex's no-count law. **Slot:** a line in LANE-PARALLEL beside
   that law. (The break itself was my HZ-NUL edit dropping the enforcer object's closing brace;
   the registry's own fail-closed arm convicted it correctly, which is the arm working.)
3. **`public/map/libs/jszip.min.js` carries C0 bytes 0x01–0x06** (vendored minified library, no
   NUL). Lawful under the ruling — whole-C0 stays at `src`/`tests`. Recorded so nobody later
   widens the tree-wide arm to whole-C0 and reds the terminal.
4. **`SNAPSHOT_MEMO`'s key could drop its separator entirely** (rung 1 of the cure ladder,
   `JSON.stringify([supplierId, commodityId])`). Not done: that CHANGES the key string and the
   ruling was the behaviour-identical conversion. **Slot:** only if the separator is to go as a
   class, and then it owes its own proof.
5. **Detection is not a contract; declaration is.** 25 `.glb` files were git-detected binary
   with nothing declaring it. Fixed here; the general lesson may apply to other asset types as
   the estate grows.
6. **`tests/lint` whole takes 557 s** and every lane must now run it before every `src/`/`tests/`
   commit (lane law 13:08). That is a real throughput cost on the shared tier. **Slot:** worth
   the chair's attention if lane contention rises; not a defect.
