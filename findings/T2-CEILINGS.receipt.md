# LANE-T2-CEILINGS — receipt to the chair (Opus lane, 2026-09-19, session 7d3418f8)

**Commit: `91d5f155b6615af6ded345377aa2bd145d858857`** on `fixes-2026-09-18-consist`,
on top of `023eda2ec`. One commit, explicit pathspec, two files. Never pushed.

Subject: `The generation worker and engine ceilings re-mint for EM-P0's pipeline seam,
attributed per module (ODQ §934.19 addendum 2; vetoable)`

## The condition — HELD (CONFIRMED)

The moved modules are exactly EM-P0's two, in BOTH chunks. A whole-build sweep over all
545 emitted chunks (matched by hash-stripped name; no chunk present in only one build)
finds exactly TWO distinct modules whose rendered length moved ANYWHERE between the two
commits. Nothing outside those two moved at all, let alone by more than 16 rendered bytes.

## The attribution table (CONFIRMED — executed)

Control `ed9d99295` (train EM-T1's green terminal), its own detached worktree, `npm ci`
exit 0. Tip `023eda2ec`. Instrument: the chair kit's `attrib.config.mjs`, run in each tree
through the EXCLUSIVE mutex.

### generation worker — base `assets/generation.worker-CDQRNnkK.js` → tip `assets/generation.worker-DlyAm0eS.js`

| module | base | tip | delta |
| --- | ---: | ---: | ---: |
| `src/generators/pipeline.js` | 9,843 | 12,548 | +2,705 |
| `src/generators/steps/generatePopulation.js` | 6,864 | 9,702 | +2,838 |
| sum of rendered deltas | | | +5,543 |

230 modules at both ends; nothing entered or left the chunk.

### lazy engine — base `assets/engine-DbLPMVNN.js` → tip `assets/engine-B1QAr5WC.js`

| module | base | tip | delta |
| --- | ---: | ---: | ---: |
| `src/generators/pipeline.js` | 9,843 | 12,548 | +2,705 |
| `src/generators/steps/generatePopulation.js` | 6,864 | 9,702 | +2,838 |
| sum of rendered deltas | | | +5,543 |

114 modules at both ends; nothing entered or left the chunk.

The same two modules also land in `customContentPreview.worker`, which carries no byte
ceiling (`tests/build/customContentPreviewLazy.test.js` is a source-shape contract only) —
which is why the chair's measurement saw exactly two build reds and not three.

## W and E with their deltas (CONFIRMED — `npm run build`, both trees, exclusive mutex)

| | base (ed9d99295) | tip (023eda2ec) | delta |
| --- | ---: | ---: | ---: |
| **W** `generation.worker-DlyAm0eS.js` | 1,399,946 | **1,401,128** | **+1,182 B** |
| **E** `engine-B1QAr5WC.js` | 676,949 | **678,131** | **+1,182 B** |

- Worker ceiling re-minted at **W exactly**, zero slack: `1399946` → `1401128`.
- Engine ceiling `677_000` → `679_000`. Proviso satisfied: 678,131 + 700 = **678,831 ≤ 679,000**
  (169 B of room above the ~700 B margin).
- The control build read the worker at **1,399,946 — exactly the standing ceiling**, i.e. the
  previous zero-slack mint reproduced at ed9d99295.

### Instrument note — why the control was ALSO built for real (JUDGMENT, vetoable)

The wrapper's `generateBundle` records `chunk.code` before a late main-graph post-processing
step: it is exact for the worker (its own Rollup pass) but reads main-graph chunks a constant
**742 B low**.

| chunk | wrapper | real `npm run build` | offset |
| --- | ---: | ---: | ---: |
| worker @ tip | 1,401,128 | 1,401,128 | 0 |
| worker @ base | 1,399,946 | 1,399,946 | 0 |
| engine @ tip | 677,389 | 678,131 | +742 |
| engine @ base | 676,207 | 676,949 | +742 |

Quoting the wrapper's 676,207 as "E at base" would have minted a **false +1,924 B delta**
across two instruments. I therefore ran a real `npm run build` in the control worktree too;
the two deltas then agree exactly at +1,182 B, which is what an identical pair of moved
modules predicts. Chunk content hashes are identical between instruments at both commits.
**Say "veto" to flip this** — the alternative is to publish the wrapper figure and its delta.

### Cross-check against the chair's own reading (CONFIRMED)

The chair read 1,401,131 B at `fefb2bb29`; this tip reads 1,401,128 B. The only `src/` change
between them is the T2 cure replacing ` — ` with `. ` in the partial-pin refusal message — an
em dash is 3 UTF-8 bytes, and 1,401,131 − 3 = 1,401,128.

## Receipts — every count line quoted from real output

**(a) `npm run verify:dist`, BARE (CONFIRMED)** — exit 0:
```
gate-mutex: acquired atomic lock at /tmp/settlementforge-vitest-gate.502.lock as PID 32806 after 0 atomic poll(s) + 0 legacy poll(s) + 0 shared-drain poll(s).
[test-ratchet] STRICT DIST OK — 59 discovered/reported file(s), 538 test(s), zero failed/non-run/uncollected/missing/extra/duplicate rows.
```
538 — the last green figure, matched.

**(b) lighting walker + mutation-coverage manifest, SHARED tier, `--maxWorkers=2` (CONFIRMED)** — exit 0:
```
gate-mutex: entered SHARED tier at /tmp/settlementforge-vitest-gate.502.lock.shared as PID 35033 after 0 poll(s); 1 shared holder(s) live, worker cap <= 2.
 Test Files  2 passed (2)
      Tests  44 passed (44)
```
No lighting red. No refreeze taken or needed.

**(c) `npx eslint tests/build/generationWorkerLazy.test.js tests/build/vendorPdfLazy.test.js` (CONFIRMED)** —
exit 0, no diagnostics printed (0 errors, 0 warnings).

**(d) the monotone mutant (CONFIRMED)** — worker constant temporarily set to W−1 = `1401127`,
run `VERIFY_DIST=1` through the shared mutex; exit 1, the red quoted verbatim:
```
AssertionError: generation worker bundle generation.worker-DlyAm0eS.js is 1401128 B; the ceiling is 1401127 B (re-minted by the worker-headroom car, 2026-09-18). A RISE IS NEVER A LANE'S EDIT: buy the bytes back, or take the ruling.: expected 1401128 to be less than or equal to 1401127
 Test Files  1 failed (1)
      Tests  1 failed | 10 passed (11)
```
The arm is load-bearing and non-vacuous: it read the real dist and the real byte count.
Constant restored; `git diff` re-read and identical to the cure.

**(e) post-restore green, the last check before the commit (CONFIRMED)** — both edited files,
`VERIFY_DIST=1`, shared tier, exit 0:
```
 Test Files  2 passed (2)
      Tests  65 passed (65)
```

## Landing proofs (CONFIRMED)

- `git show --stat HEAD` names exactly `tests/build/generationWorkerLazy.test.js` and
  `tests/build/vendorPdfLazy.test.js`, 25 insertions / 2 deletions.
- `git status --short` in the slot: empty.
- The pre-commit hook ran `eslint --fix` over the two files and **rewrote neither**: the
  committed blobs (`5ca861cd4`, `55a5d0e3d`) are byte-identical to the blobs I staged, so
  5a–5c stand as run and were not re-run.
- Both trailers kept: `Claude Fable 5.1` (the brief's) and `Claude Opus 5 (1M context)`
  (the harness's), per the chair's standing ruling.
- Control worktree `$SP/attrib-base-ed9d99295` removed.
- No stray files in the slot: `attrib.config.mjs` and `dist-attrib/` deleted before the edit.

## Noticed and NOT touched

1. **The cheap buy-back I SAW in EM-P0's two files — named, not made (PLAUSIBLE, unmeasured).**
   In `src/generators/steps/generatePopulation.js`, the extraction of `powerLinkage()` turned
   five formerly-local `const`s into an **object literal's property names**: `pfList`,
   `governingPF`, `powerFactionsByCategory`, `pfAttractionMap`, `totalPower`. Local `const`
   names are freely mangled to single letters; object property names are not (property
   mangling is off by default because it is unsafe). Each name now survives minification at
   the literal site AND at `linkFactions`'s destructure, and `powerFactionsByCategory` a third
   time at the `linkCounts` trace — roughly 150 characters of identifier text per chunk that
   used to be single letters. **The buy-back:** return a positional array and destructure
   `const [pfList, governingPF, powerFactionsByCategory, pfAttractionMap, totalPower] = power;`,
   or keep the linkage inline in `derivePopulation` as locals. Estimated ~150 B of the 1,182 B
   in EACH of the worker and the engine (~13%), and it rides three chunks. **Estimated, not
   measured** — measuring it means making it, which this lane is forbidden to do.
2. **A smaller second candidate (PLAUSIBLE).** `Object.prototype.hasOwnProperty.call(...)`
   appears once in each file (`pipeline.js:196`, `generatePopulation.js:42`) as an un-manglable
   global property chain. Hoisting a module-local `const hasOwn = Object.prototype.hasOwnProperty;`
   in each file, or using `Object.hasOwn(...)`, would shave a few dozen bytes per file — but
   `Object.hasOwn` is ES2022 and is a browser-support call, not a lane's.
3. **Not a byte issue, flagged for the record.** `powerLinkage(powerStructure)` is called
   unconditionally in `derivePopulation` even when `factions` is pinned, so in pinned mode the
   sort/reduce/map runs and only `powerFactionsByCategory` is consumed (by the `linkCounts`
   trace, which genuinely needs it). Wasted work in pinned mode, not wasted bytes, and not a
   defect — recorded so it is not re-found as one.
4. **Foreign WIP left alone.** `git stash list` in the shared tree carries a pre-existing
   `stash@{0}: On analytics-intelligence-layer: generation-tuning fixes`. It is not the
   pre-commit hook's backup (that one was created and cleaned up during my commit) and it is
   not mine. Untouched.
5. **`dist/` left in place** in the slot (gitignored) — it is the build the receipts measured,
   and the chair may want to re-read it. Delete at will.
